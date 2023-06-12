import { Button, Input } from "antd";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import { useContext, useEffect, useState } from "react";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";
import CustomNFTTokenInstance from "../blockchain/contractInstances/CustomNFTTokenInstance";
import web3 from "../blockchain/web3";
import useDeepCompareEffect from "use-deep-compare-effect";
import "./Partial.css";
import useConfig from "antd/es/config-provider/hooks/useConfig";
import { MyContext } from "../MyContext";

const nullAddr = "0x0000000000000000000000000000000000000000";

const Partial = ({ item, addresses, updateItem, balance }) => {
  const [sendTokenValue, setSendTokenValue] = useState();
  const [sendTokenTo, setSendTokenTo] = useState();
  const [listTokenPercentage, setListTokenPercentage] = useState();
  const [listTokenPrice, setListTokenPrice] = useState();
  const { setLoading } = useContext(MyContext);

  const sendNftTokenHandler = async () => {
    if (
      Number(
        await item.nftTokenInstance.methods
          .allowance(addresses[0], MarketplaceInstance._address)
          .call()
      ) < sendTokenValue
    ) {
      return alert(
        "Please approve access to nft ownership to perform function."
      );
    }
    setLoading(true);
    try {
      await MarketplaceInstance.methods
        .sendNFTTokens(item.itemId, sendTokenValue, sendTokenTo)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };
  const nftTokenAccessHandler = async () => {
    setLoading(true);
    try {
      await item.nftTokenInstance.methods
        .approve(MarketplaceInstance._address, item.myNFTOwnership)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  const tokenAccessHandler = async (e, list) => {
    const amount = document.getElementById(list.lister + list.price).value;
    const perc = await tokenParentInstance.methods
      .balanceOf(addresses[0])
      .call();
    if (Number(perc) < Number(amount)) {
      return alert("Please get enough bidTokens to bid on item.");
    }
    setLoading(true);
    try {
      await tokenParentInstance.methods
        .approve(MarketplaceInstance._address, amount)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  const listNftTokenHandler = async () => {
    const perc = await item.nftTokenInstance.methods
      .allowance(addresses[0], MarketplaceInstance._address)
      .call();
    if (Number(perc) < Number(listTokenPercentage)) {
      return alert(
        "Please approve access to nft ownership to perform function."
      );
    }
    setLoading(true);
    try {
      await MarketplaceInstance.methods
        .listToken(item.itemId, listTokenPercentage, listTokenPrice)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  const tokenBidHandler = async (e, list) => {
    const lister = e.target.id;
    const amount = document.getElementById(list.lister + list.price).value;
    if (
      Number(await tokenParentInstance.methods.balanceOf(addresses[0]).call()) <
      Number(amount)
    ) {
      return alert("Please get enough bidTokens to bid on item.");
    }
    if (
      (await tokenParentInstance.methods
        .allowance(addresses[0], MarketplaceInstance._address)
        .call()) < amount
    ) {
      return alert("Please allow access to enough bidTokens to bid on item.");
    }
    setLoading(true);
    try {
      await MarketplaceInstance.methods
        .bidOnToken(item.itemId, list.lister, amount)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  const confirmTokenSaleHandler = async () => {
    setLoading(true);
    try {
      await MarketplaceInstance.methods
        .confirmTokenSale(item.itemId, addresses[0])
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  const redeemNFTHandler = async () => {
    if (
      Number(
        await item.nftTokenInstance.methods
          .allowance(addresses[0], MarketplaceInstance._address)
          .call()
      ) < 100
    ) {
      return alert(
        "Please approve access to nft ownership to perform function."
      );
    }
    setLoading(true);
    try {
      await MarketplaceInstance.methods
        .returnNFT(item.itemId)
        .send({ from: addresses[0] });
    } catch (e) {
      alert("Transaction failed!");
      setLoading();
    }
    setLoading();
  };

  return (
    <div className="partial">
      {item?.partial && (
        <>
          <div className="line long"></div>
          <div className="flex">
            <h2 style={{ margin: "1rem" }}>Owners</h2>
            {item.myNFTOwnership > 0 && (
              <p>
                <b> my ownership :</b> {item.myNFTOwnership} percent
              </p>
            )}
            <div>
              {item.balances?.map((bal) =>
                bal.percentage > 0 && bal.owner != addresses[0] ? (
                  <p className="gap" key={bal.owner}>
                    <b> owner:</b> {bal.owner}
                    <b>percentage:</b>
                    {bal.percentage}
                  </p>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
          <div className="line long"></div>
          <h3 className="your-balance">
            <b> Your bidToken Balance: </b>
            {balance}
          </h3>
          {item.lists?.length > 0 && <h2>Listings for Sale</h2>}
          {item.lists && (
            <div>
              {item.lists.map((list) => (
                <div key={list.lister} className="list center">
                  <p className="gap">
                    <b>lister: </b> {list.lister} <b>price :</b> {list.price}
                    <b>percentage :</b> {list.percentage}
                  </p>

                  <div className="center">
                    {list.bids?.length > 0 && <h3>bids:</h3>}
                    {list.bids &&
                      list.bids.map((bid) => (
                        <div key={bid.bidder}>
                          <p className="gap">
                            <b>bidder:</b> {bid.bidder} <b>value:</b>
                            {bid.value}
                          </p>
                        </div>
                      ))}
                  </div>

                  {list.lister != addresses[0] && (
                    <div className="form-item">
                      <Input
                        placeholder="amount"
                        id={list.lister + list.price}
                      ></Input>
                      <Button
                        onClick={(e) => {
                          tokenAccessHandler(e, list);
                        }}
                        id={list.lister}
                      >
                        Allow token Access
                      </Button>
                      <Button
                        onClick={(e) => {
                          tokenBidHandler(e, list);
                        }}
                        id={list.lister}
                      >
                        Bid
                      </Button>
                    </div>
                  )}

                  {list.lister == addresses[0] && list.bids.length > 0 && (
                    <Button onClick={confirmTokenSaleHandler}>
                      Confirm Token Sale
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="line long"></div>

          {item.myNFTOwnership > 0 && (
            <>
              <div>
                <Button onClick={nftTokenAccessHandler}>
                  Approve Ownership Access
                </Button>
              </div>
              <div className="form-item">
                <Input
                  placeholder="percentage"
                  onChange={(e) => setSendTokenValue(e.target.value)}
                ></Input>
                <Input
                  placeholder="to"
                  onChange={(e) => setSendTokenTo(e.target.value)}
                ></Input>
                <Button onClick={sendNftTokenHandler}>Send</Button>
              </div>
              <div className="form-item">
                <Input
                  placeholder="price"
                  onChange={(e) => setListTokenPrice(e.target.value)}
                ></Input>
                <Input
                  placeholder="percentage"
                  onChange={(e) => setListTokenPercentage(e.target.value)}
                ></Input>
                <Button onClick={listNftTokenHandler}>List</Button>
              </div>

              {item.myNFTOwnership == 100 && (
                <div>
                  <Button onClick={redeemNFTHandler}>Redeem NFT</Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Partial;
