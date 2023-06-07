import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomNFTInstance from "../blockchain/contractInstances/CustomNFTInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import Web3 from "web3";
import NFTInstance from "../blockchain/contractInstances/NFTInstance";
import web3 from "../blockchain/web3";
const SingleNFT = () => {
  const { id } = useParams();
  const [address, tokenId, itemId] = id.split("-");
  const [item, setItem] = useState();
  const [sendTo, setSendTo] = useState();
  const curNFTInstance = CustomNFTInstance(address);
  const [addresses, setAddresses] = useState();

  useEffect(() => {
    (async () => {
      setAddresses(await web3.eth.requestAccounts());
      const curNFTUriLoc = await curNFTInstance.methods
        .tokenURI(tokenId)
        .call();
      let nftUri = await fetch("https://ipfs.io/ipfs/" + curNFTUriLoc);
      nftUri = await nftUri.json();
      const now = await MarketplaceInstance.methods.items(itemId).call();
      setItem((i) => {
        return { ...i, ...now };
      });
      setItem((i) => {
        return { ...i, ...nftUri };
      });
    })();
    return setItem();
  }, []);

  const sendHandler = async () => {
    const res = await MarketplaceInstance.methods
      .sendNFT(item.itemId, sendTo)
      .send({ from: addresses[0] });
    console.log(res);
  };

  const accessHandler = async () => {
    const res = await NFTInstance.methods
      .setApprovalForAll(MarketplaceInstance._address, true)
      .send({ from: addresses[0] });
    console.log(res);
  };

  return (
    <>
      {item && (
        <div>
          <p> name: {item?.name}</p>
          <p> owner: {item?.owner}</p>
          <p> itemId : {item?.itemId}</p>
          <p> tokenId : {item?.tokenId}</p>
          <div>
            <input
              onChange={(e) => setSendTo(e.target.value)}
              placeholder="to"
            ></input>
            <button onClick={accessHandler}>Allow Access</button>
            <button onClick={sendHandler}>Send</button>
          </div>
          <img src={"https://ipfs.io/ipfs/" + item?.image}></img>
        </div>
      )}
    </>
  );
};

export default SingleNFT;
