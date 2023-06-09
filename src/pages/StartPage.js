import { useContext, useEffect, useState } from "react";
import web3 from "../blockchain/web3";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import "./StartPage.css";
import { Button } from "antd";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
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
    const network = await web3.eth.net.getId();
    console.log(network);
    if (acc && acc[0] && network == "11155111") {
      navigate("/home");
    } else if (!(acc && acc[0])) {
      navigate("/home");
      return alert("Some functions might not work without metamask.");
    } else {
      navigate("/home");
      return alert(
        "Some functions might not work on network other than sepolia."
      );
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
