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
  "0xf33a538F6586647A41Af327258eF354c85eAb577"
);

export default bidTokenInstance;
