import { useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import bidTokenInstance from "../blockchain/contractInstances/bidTokenInstance";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";

const Tokens = () => {
  const [addresses, setAddresses] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    (async function () {
      setAddresses(await web3.eth.requestAccounts());
      addresses &&
        setBalance(
          await tokenParentInstance.methods.balanceOf(addresses[0]).call()
        );
    })();
  }, [addresses && addresses[0], balance]);

  const [buyValue, setBuyValue] = useState();
  const [sellValue, setSellValue] = useState();
  const buyHandler = async () => {
    await bidTokenInstance.methods
      .buy()
      .send({ from: addresses[0], value: buyValue });
  };
  const accessHandler = async () => {
    await tokenParentInstance.methods
      .increaseAllowance(bidTokenInstance._address, sellValue)
      .send({ from: addresses[0] });
  };
  const sellHandler = async () => {
    await bidTokenInstance.methods.sell(sellValue).send({ from: addresses[0] });
  };
  return (
    <div>
      {addresses && <h2>{addresses[0]}</h2>}
      <h2>{balance}</h2>
      <div>
        <input
          onChange={(e) => setBuyValue(e.target.value)}
          placeholder="value"
        ></input>
        <button onClick={buyHandler}>Buy</button>
      </div>
      <div>
        <input
          onChange={(e) => setSellValue(e.target.value)}
          placeholder="value"
        ></input>
        <button onClick={accessHandler}>Allow Access</button>
        <button onClick={sellHandler}>Sell</button>
      </div>
    </div>
  );
};

export default Tokens;
