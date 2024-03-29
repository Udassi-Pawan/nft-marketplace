import web3 from "../web3";
import bidTokenInstance from "./bidTokenInstance";

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalSupply",
        "type": "uint256",
      },
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
      {
        "internalType": "address",
        "name": "_mintAddress",
        "type": "address",
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
        "name": "_spender",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
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
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
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
        "name": "_owner",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_spender",
        "type": "address",
      },
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "remaining",
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
        "name": "_spender",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool",
      },
    ],
    "stateMutability": "nonpayable",
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
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "exchangeRate",
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
        "name": "_spender",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool",
      },
    ],
    "stateMutability": "nonpayable",
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
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256",
      },
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool",
      },
    ],
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
        "name": "value",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "function",
  },
];

let tokenParentInstance;
try {
  const address = await bidTokenInstance.methods.bidToken().call();
  tokenParentInstance = new web3.eth.Contract(abi, address);
  console.log(address);
} catch (e) {}
export default tokenParentInstance;
