import { useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import bidTokenInstance from "../blockchain/contractInstances/bidTokenInstance";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import "./Tokens.css";
import { Button, Form, Input } from "antd";

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
    <div className="token">
      {addresses && <h2> Current Account: {addresses[0]}</h2>}
      <h2> Current bidToken balance: {balance}</h2>
      <div className="item">
        <Form.Item>
          <Input
            onChange={(e) => setBuyValue(e.target.value)}
            placeholder="value"
          ></Input>
        </Form.Item>
        <Button type="primary" onClick={buyHandler}>
          Buy
        </Button>
      </div>
      <div className="item">
        <Input
          onChange={(e) => setSellValue(e.target.value)}
          placeholder="value"
        ></Input>
        <Button type="primary" onClick={accessHandler}>
          Allow Access
        </Button>
        <Button type="primary" onClick={sellHandler}>
          Sell
        </Button>
      </div>
    </div>
  );
};

export default Tokens;
