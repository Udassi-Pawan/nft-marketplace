import web3 from "../web3";

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "bidItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "_lister",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "bidOnToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
    ],
    "name": "confirmSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "_lister",
        "type": "address",
      },
    ],
    "name": "confirmTokenSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256",
      },
    ],
    "name": "listItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_percent",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256",
      },
    ],
    "name": "listToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC721",
        "name": "_nft",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "_uri",
        "type": "string",
      },
    ],
    "name": "makeItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
    ],
    "name": "optOutSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
    ],
    "name": "partializeNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
    ],
    "name": "returnNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
    ],
    "name": "sendNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_percentage",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
    ],
    "name": "sendNFTTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_bidTokenAddress",
        "type": "address",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "inputs": [],
    "name": "feeAccount",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "feePercent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_bidNumber",
        "type": "uint256",
      },
    ],
    "name": "getBid",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "bidder",
            "type": "address",
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256",
          },
        ],
        "internalType": "struct NFTMarketplace.bid",
        "name": "",
        "type": "tuple",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256",
      },
    ],
    "name": "getTotalPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "itemCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "items",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256",
      },
      {
        "internalType": "contract IERC721",
        "name": "nft",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "bidNumber",
        "type": "uint256",
      },
      {
        "internalType": "address payable",
        "name": "owner",
        "type": "address",
      },
      {
        "internalType": "bool",
        "name": "sold",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "nftTokenAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "tokenBidNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "tokenBids",
    "outputs": [
      {
        "internalType": "address",
        "name": "bidder",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "tokenList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "percentage",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];

const MarketplaceInstance = new web3.eth.Contract(
  abi,
  "0x4aF3aF659e40Db27C5482761BE41415c53551b3D"
);

export default MarketplaceInstance;
