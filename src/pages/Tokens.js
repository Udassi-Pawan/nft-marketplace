import { useContext, useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import bidTokenInstance from "../blockchain/contractInstances/bidTokenInstance";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import "./Tokens.css";
import { Button, Form, Input } from "antd";
import { MyContext } from "../MyContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Tokens = () => {
  const [addresses, setAddresses] = useState();
  const [balance, setBalance] = useState();

  const [buyValue, setBuyValue] = useState();
  const [sellValue, setSellValue] = useState();
  const { setLoading, loading } = useContext(MyContext);

  useEffect(() => {
    (async function () {
      setAddresses(await web3.eth.requestAccounts());
      addresses &&
        setBalance(
          await tokenParentInstance.methods.balanceOf(addresses[0]).call()
        );
    })();
  }, [addresses && addresses[0], balance, loading]);

  async function smartCall(functionName, context, args) {
    setLoading(true);
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    try {
      await context[func].apply(context, args).send({ from: addresses[0] });
    } catch (e) {
      setLoading();
      alert("Transaction Failed!");
    }
    setLoading();
  }

  const buyHandler = async () => {
    setLoading(true);
    try {
      await bidTokenInstance.methods
        .buy()
        .send({ from: addresses[0], value: buyValue });
    } catch (e) {
      setLoading();
    }
    setLoading();
  };

  return (
    <LoadingSpinner>
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
          <Button
            type="primary"
            onClick={async (e) => {
              if (
                (await tokenParentInstance.methods.balanceOf(addresses[0])) <
                sellValue
              )
                return alert("Not enough tokens to sell!");
              smartCall(
                "methods.increaseAllowance",
                tokenParentInstance,
                bidTokenInstance._address,
                sellValue
              );
            }}
          >
            Allow Access
          </Button>
          <Button
            type="primary"
            onClick={async (e) => {
              if (
                (await tokenParentInstance.methods
                  .balanceOf(addresses[0])
                  .call()) < sellValue
              )
                return alert("Not enough tokens to sell!");
              if (
                (await tokenParentInstance.methods
                  .allowance(addresses[0], bidTokenInstance._address)
                  .call()) < sellValue
              )
                return alert("Please allow access to tokens to sell!");
              smartCall("methods.sell", bidTokenInstance, sellValue);
            }}
          >
            Sell
          </Button>
        </div>
      </div>
    </LoadingSpinner>
  );
};

export default Tokens;
