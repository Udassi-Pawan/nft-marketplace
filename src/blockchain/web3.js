import Web3 from "web3";

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://eth-sepolia.g.alchemy.com/v2/" + process.env.REACT_APP_SEPOLIA_URL
);
if (typeof window.ethereum == "undefined") web3 = new Web3(provider);
else web3 = new Web3(window.ethereum);
export default web3;
