// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface bidTokenInterface {
    function balanceOf(address _owner) external returns (uint256 balance);
    function transfer(address _to, uint256 value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function increaseAllowance(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


contract NFTMarketplace is ReentrancyGuard {
   address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public immutable royalty; // the fee percentage on sales 
    uint public itemCount; 
    address private bidTokenAddress;
    
    struct bid {
    address bidder;
    uint value;
    }

bidTokenInterface private bidToken;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        mapping(uint => bid) bids;
        uint bidNumber;
        address payable seller;
        address payable creator;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event NFTAdded(
        uint itemId,
        address indexed nft,
        uint tokenId,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(address _bidTokenAddress) {
        feeAccount = payable(msg.sender);
        feePercent = 10;
        royalty = 10;
         bidToken = bidTokenInterface(_bidTokenAddress);
    }

    function makeItem(IERC721 _nft, uint _tokenId) external nonReentrant {
        itemCount ++;
        Item storage i = items[itemCount];
        i.bidNumber = 0;
        i.creator = payable (msg.sender);
        i.itemId = itemCount;
        i.nft = _nft;
        i.price = 0;
        i.seller = payable (msg.sender);
        i.sold = true;
        i.tokenId = _tokenId;

        emit NFTAdded (
            itemCount,
            address(_nft),
            _tokenId,
            msg.sender
        );
    }

    function listItem(uint _itemId, uint _price) external  {
        Item storage item = items[_itemId];
        item.nft.transferFrom(msg.sender, address(this), _itemId);
        item.price = getTotalPrice(_price);
        item.sold = false;
    }

    function bidItem(uint _itemId,uint _value) external 
{
        Item storage item = items[_itemId];
        require(_value>=item.price &&  (item.bidNumber==0 || _value >= item.bids[item.bidNumber].value));
        require(bidToken.allowance(msg.sender,address(this))>=_value);
        item.bids[item.bidNumber++]=(bid(msg.sender,_value));
}



function confirmSale (uint _itemId) external{
        Item storage item = items[_itemId];
        require(msg.sender==item.seller);
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(item.bidNumber>0,"no bids");
        address purchaser = item.bids[item.bidNumber-1].bidder;    
        uint salePrice = item.bids[item.bidNumber-1].value;    
        require(!item.sold, "item already sold");
        require(bidToken.allowance(purchaser,address(this))>= salePrice);
        bidToken.transferFrom(purchaser,item.seller, ((salePrice)*5)/6);
        bidToken.transferFrom(purchaser,item.creator, (salePrice/6));
        bidToken.transferFrom(purchaser,address(this), (salePrice/6));
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
   
}
    
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent + royalty))/100);
    }

    function optOutSale(uint _itemId) public {
        Item storage item = items[_itemId];
        require(item.seller==msg.sender);
        item.sold = true;
        item.price = 0;
    }
}