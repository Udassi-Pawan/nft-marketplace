import web3 from "../web3";

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "inputs": [],
    "name": "bidToken",
    "outputs": [
      {
        "internalType": "contract Token",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      },
    ],
    "name": "sell",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
];

const bidTokenInstance = new web3.eth.Contract(
  abi,
  "0x0922E66C5a7849091ECcEB1095b83db56eaC925c"
);

export default bidTokenInstance;
