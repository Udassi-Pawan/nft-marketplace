import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomNFTInstance from "../blockchain/contractInstances/CustomNFTInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import Web3 from "web3";
import NFTInstance from "../blockchain/contractInstances/NFTInstance";
import web3 from "../blockchain/web3";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";

const SingleNFT = () => {
  const { id } = useParams();
  const [address, tokenId, itemId] = id.split("-");
  const [item, setItem] = useState();
  const [sendTo, setSendTo] = useState();
  const curNFTInstance = CustomNFTInstance(address);
  const [addresses, setAddresses] = useState();
  const [listPrice, setListPrice] = useState();
  const [bidValue, setBidValue] = useState();
  const [balance, setBalance] = useState();

  window.ethereum.on("accountsChanged", async function () {
    setAddresses(await web3.eth.requestAccounts());
  });

  const updateItem = async () => {
    const now = await MarketplaceInstance.methods.items(itemId).call();
    const bidNumber = now.bidNumber;
    const bids = [];
    for (let i = 1; i <= bidNumber; i++) {
      bids.push(await MarketplaceInstance.methods.getBid(itemId, i).call());
    }
    now.bids = bids;
    setItem((i) => {
      return { ...i, ...now };
    });
    console.log("updates");
  };

  useEffect(() => {
    (async () => {
      setAddresses(await web3.eth.requestAccounts());
      addresses &&
        setBalance(
          await tokenParentInstance.methods.balanceOf(addresses[0]).call()
        );
      const curNFTUriLoc = await curNFTInstance.methods
        .tokenURI(tokenId)
        .call();
      let nftUri = await fetch("https://ipfs.io/ipfs/" + curNFTUriLoc);
      nftUri = await nftUri.json();
      updateItem(itemId);
      setItem((i) => {
        return { ...i, ...nftUri };
      });
    })();
  }, [addresses && addresses[0]]);

  const sendHandler = async () => {
    await MarketplaceInstance.methods
      .sendNFT(item.itemId, sendTo)
      .send({ from: addresses[0] });
    updateItem(itemId);
  };
  const accessHandler = async () => {
    await NFTInstance.methods
      .setApprovalForAll(MarketplaceInstance._address, true)
      .send({ from: addresses[0] });
  };

  const tokenAccessHandler = async () => {
    await tokenParentInstance.methods
      .increaseAllowance(MarketplaceInstance._address, bidValue)
      .send({ from: addresses[0] });
  };
  const listHandler = async () => {
    await MarketplaceInstance.methods
      .listItem(item.itemId, listPrice)
      .send({ from: addresses[0] });
  };

  const bidHandler = async () => {
    await MarketplaceInstance.methods
      .bidItem(itemId, bidValue)
      .send({ from: addresses[0] });
    updateItem(itemId);
  };

  const confirmSaleHandler = async () => {
    await MarketplaceInstance.methods
      .confirmSale(item.itemId)
      .send({ from: addresses[0] });
    updateItem();
  };

  console.log(balance);
  return (
    <>
      {item && (
        <div>
          <p> name: {item?.name}</p>
          <p> owner: {item?.owner}</p>
          <p> itemId : {item?.itemId}</p>
          <p> tokenId : {item?.tokenId}</p>
          <h3> balance : {balance}</h3>
          <div>
            {item.bids?.map((bid, ind) => (
              <div key={ind}>
                <p>
                  {bid.bidder} : {bid.value}
                </p>
              </div>
            ))}
          </div>
          {!item.sold && <p> price : {item?.price}</p>}
          {item.owner == addresses[0] && (
            <div>
              <input
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="to"
              ></input>
              <button onClick={accessHandler}>Allow Access</button>
              <button onClick={sendHandler}>Send</button>
            </div>
          )}
          {item.owner == addresses[0] && item.sold && (
            <div>
              <input
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="price"
              ></input>
              <button onClick={accessHandler}>Allow Access</button>
              <button onClick={listHandler}>List</button>
            </div>
          )}
          {item.owner != addresses[0] && (
            <div>
              <input
                placeholder="value"
                onChange={(e) => setBidValue(e.target.value)}
              />
              <button onClick={tokenAccessHandler}>allow token access</button>
              <button onClick={bidHandler}>bid</button>
            </div>
          )}

          <div>
            {item.owner == addresses[0] && item.bidNumber > 0 && (
              <button onClick={confirmSaleHandler}>
                Confirm Sale to highest bidder
              </button>
            )}
          </div>

          <img src={"https://ipfs.io/ipfs/" + item?.image}></img>
        </div>
      )}
    </>
  );
};

export default SingleNFT;
