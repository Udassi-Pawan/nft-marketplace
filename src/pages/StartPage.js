import { useContext, useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import "./StartPage.css";
import { Button } from "antd";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import Layout, { Content, Header } from "antd/es/layout/layout";

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
    <>
      <LoadingSpinner>
        <div className="desclaimer-parent">
          <h1>NFT Marketplace</h1>
          <h3>
            Please install and connect metamask using sepolia testnet to
            continue
          </h3>
          <Button onClick={clickHandler}>Continue</Button>;
        </div>
      </LoadingSpinner>
    </>
  );
};

export default StartPage;
