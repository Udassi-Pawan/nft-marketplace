import { useContext, useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import "./StartPage.css";
import { Button } from "antd";

const StartPage = () => {
  const navigate = useNavigate();
  const [acc, setAcc] = useState();
  useEffect(() => {
    (async function () {
      try {
        setAcc(await web3.eth.requestAccounts());
        console.log("connect");
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  const clickHandler = async () => {
    if (acc && acc[0]) {
      navigate("/home");
    } else {
      navigate("/home");
      alert("Some functions might not work without metamask.");
    }
  };
  return (
    <div className="desclaimer-parent">
      <h1>NFT Marketplace</h1>
      <h3>
        Please install and connect metamask using sepolia testnet to continue
      </h3>
      <Button onClick={clickHandler}>Continue</Button>;
    </div>
  );
};

export default StartPage;
