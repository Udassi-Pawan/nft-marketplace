// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "./ReentrancyGuard.sol";
import "./nftToken.sol";
import "./bidTokenInterface.sol";
import "./IERC721Interface.sol";

contract NFTMarketplace is ReentrancyGuard {
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 
    address private bidTokenAddress;
    struct bid {
    address bidder;
    uint value;
    }

bidTokenInterface private bidToken;
tokenParentInterface private tokenParent;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        uint bidNumber;
        address payable owner;
        bool sold;
    }


    // itemId -> Item
    mapping(uint => Item) public items;
    mapping (uint => mapping (uint=> bid) ) private bids;


    constructor(address _bidTokenAddress) {
        feeAccount = payable(msg.sender);
        feePercent = 10;
         bidToken = bidTokenInterface(_bidTokenAddress);
         tokenParent = tokenParentInterface(bidToken.bidToken());
    }

    function makeItem(IERC721 _nft, string memory _uri) external nonReentrant {
        uint tokenId = _nft.totalSupply(); 
        _nft.mintTo(msg.sender,_uri);
        Item storage i = items[itemCount];
        i.itemId = itemCount;
        i.owner = payable(msg.sender);
        i.price = 0;
        i.sold = true;
        i.tokenId = tokenId;
        i.bidNumber = 0;      
        i.nft = _nft;  
        itemCount++;
    }


    function sendNFT(uint _itemId, address _to) public {
        Item storage item = items[_itemId];
        require(msg.sender == item.owner);
        item.nft.transferFrom(item.owner,_to,item.tokenId);
        resetNFTToFull(_itemId);
    }

    function listItem(uint _itemId, uint _price) external  {
        Item storage item = items[_itemId];
        require(item.nft.isApprovedForAll(item.owner,address(this)) || item.nft.getApproved(item.tokenId)==address(this));
        item.price = getTotalPrice(_price);
        item.sold = false;
    }


    function bidItem(uint _itemId,uint _value) external 
{
        Item storage item = items[_itemId];
        require(_value>=item.price &&  (item.bidNumber==0 || _value >= bids[item.itemId][item.bidNumber].value));
        require(tokenParent.allowance(msg.sender,address(this))>=_value);
        bids[item.itemId][++item.bidNumber]=(bid(msg.sender,_value));
}

function getBid(uint _itemId, uint _bidNumber) view public returns (bid memory) {
        Item storage item = items[_itemId];
    require(item.bidNumber>=_bidNumber) ;
    return bids[_itemId][_bidNumber];
}

function confirmSale (uint _itemId) external{
        Item storage item = items[_itemId];
        require(msg.sender==item.owner);
        require(_itemId >= 0 && _itemId < itemCount, "item doesn't exist");
        require(item.bidNumber>0,"no bids");
        address purchaser = bids[item.itemId][item.bidNumber].bidder;    
        uint salePrice = bids[item.itemId][item.bidNumber].value;    
        require(!item.sold, "item already sold");
        require(tokenParent.allowance(purchaser,address(this))>= salePrice);
        tokenParent.transferFrom(purchaser,item.owner, ((salePrice)*5)/6);
        tokenParent.transferFrom(purchaser,feeAccount, (salePrice/6));
        item.nft.transferFrom(item.owner, purchaser , item.tokenId);
       resetNFTToFull(_itemId);
      }
    
    function getTotalPrice(uint _price) view public returns(uint){
        return(_price*(100 + feePercent))/100;
    }

    function optOutSale(uint _itemId) public {
        Item storage item = items[_itemId];
        require(item.owner==msg.sender);
        resetNFTToFull(_itemId);
    }

    // itemId => tokenAddress
    mapping (uint => address ) public nftTokenAddresses;
    // itemid => owners => list 
    mapping (address => mapping(address => list )  )   public tokenList ;
    // mapping (uint => uint  ) tokenListNumber ;
    mapping(address => mapping(address=>  mapping(uint => bid) )) public tokenBids;

    mapping (address => mapping(address => uint)  ) public tokenBidNumber;

    function partializeNFT (uint _itemId) public {
        Item storage item = items[_itemId];
        require(msg.sender==item.owner);
        require(item.nft.isApprovedForAll(item.owner,address(this)) || item.nft.getApproved(item.tokenId)==address(this));
        item.nft.transferFrom(item.owner, address(this) , item.tokenId);
        resetNFTToFull(_itemId);
        nftToken nftToken20 = new nftToken(msg.sender);
        nftTokenAddresses[item.itemId] = address(nftToken20);
    }

    function returnNFT(uint _itemId) public {
        Item storage item = items[_itemId];
        nftToken nftToken20 = nftToken(nftTokenAddresses[item.itemId]);
        require(nftToken20.balanceOf(msg.sender)==100);
        require(nftToken20.allowance(msg.sender,address(this))==100);
        nftToken20.transferFrom(msg.sender,address(this),100);
        item.nft.transferFrom(address(this),msg.sender,item.tokenId);
        resetNFTToFull(_itemId);
    }

    struct list {
        uint percentage;
        uint price;
    }

    function listToken (uint _itemId, uint _percent, uint _price) public {
        Item storage item = items[_itemId];
        address addr = nftTokenAddresses[_itemId];
        nftToken nftToken20 = nftToken(nftTokenAddresses[item.itemId]);
        require( _percent>0 && nftToken20.balanceOf(msg.sender)>=_percent );
        require(nftToken20.allowance(msg.sender,address(this))>=_percent );
        tokenList[addr][msg.sender] = list(_percent, _price) ;
    }

    function bidOnToken(uint _itemId, address _lister, uint _value) public {
        address addr = nftTokenAddresses[_itemId];
        uint num = tokenBidNumber[addr][_lister];
        require(num==0 || _value >= tokenBids[addr][_lister][num].value);
        require(tokenParent.balanceOf(msg.sender)>=_value && tokenParent.allowance(msg.sender,address(this))>=_value);
        tokenBids[addr][_lister][++num] = bid(msg.sender,_value);
        tokenBidNumber[addr][_lister]++;
    }

    function confirmTokenSale(uint _itemId, address _lister) public {
        Item storage item = items[_itemId];
        address addr = nftTokenAddresses[_itemId];
        uint num = tokenBidNumber[addr][_lister];
        require(msg.sender == _lister);
        address purchaser = tokenBids[addr][_lister][num].bidder;
        uint bidTokenValue = tokenBids[addr][_lister][num].value;
        address seller = _lister;
        uint nftTokenValue = tokenList[addr][_lister].percentage;
        nftToken nftToken20 = nftToken(nftTokenAddresses[item.itemId]);
        require(tokenParent.balanceOf( purchaser )>= bidTokenValue && tokenParent.allowance(purchaser,address(this))>=bidTokenValue);
        require( nftToken20.balanceOf(_lister)>= nftTokenValue && nftToken20.allowance(msg.sender,address(this))>= nftTokenValue );
        nftToken20.transferFrom(_lister, purchaser, nftTokenValue );
        tokenParent.transferFrom(purchaser,seller, bidTokenValue );
      delete  tokenList[addr][msg.sender];
        tokenBidNumber[addr][_lister] = 0;
    }

    function sendNFTTokens( uint _itemId, uint _percentage, address _to ) public {
        address addr = nftTokenAddresses[_itemId];
        Item storage item = items[_itemId];
        nftToken nftToken20 = nftToken(nftTokenAddresses[item.itemId]);
        require(nftToken20.balanceOf(msg.sender)>=_percentage && nftToken20.allowance(msg.sender,address(this))>=_percentage);
        nftToken20.transferFrom(msg.sender,_to,_percentage);
        if(nftToken20.balanceOf(msg.sender) < tokenList[addr][msg.sender].percentage) {
             delete  tokenList[addr][msg.sender];
        tokenBidNumber[addr][msg.sender] = 0;
        }
    }

    function resetNFTToFull (uint _itemId) private {
        Item storage item = items[_itemId];
        item.price = 0;
        item.bidNumber = 0;
        item.owner = payable (item.nft.ownerOf(item.tokenId));
        item.sold = true;
        delete nftTokenAddresses[_itemId];
    }
}