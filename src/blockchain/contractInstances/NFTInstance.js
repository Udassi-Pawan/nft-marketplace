import web3 from "../web3";

const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_approved",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_operator",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "_approved",
        "type": "bool",
      },
    ],
    "name": "ApprovalForAll",
    "type": "event",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_approved",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "_uri",
        "type": "string",
      },
    ],
    "name": "mintTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address",
      },
      {
        "internalType": "bool",
        "name": "_approved",
        "type": "bool",
      },
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address",
      },
    ],
    "name": "balanceOf",
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
    "name": "contractOwner",
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
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "getApproved",
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
        "name": "_owner",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address",
      },
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "nextTokenIdToMint",
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
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "ownerOf",
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
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
];

const NFTInstance = new web3.eth.Contract(
  abi,
  "0x0d3cE957B5cc7F457AEeaEF19733041854C682A0"
);

export default NFTInstance;
