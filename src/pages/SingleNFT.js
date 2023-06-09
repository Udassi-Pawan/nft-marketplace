import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomNFTInstance from "../blockchain/contractInstances/CustomNFTInstance";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import Web3 from "web3";
import NFTInstance from "../blockchain/contractInstances/NFTInstance";
import web3 from "../blockchain/web3";
import tokenParentInstance from "../blockchain/contractInstances/tokenParentInstance";
import CustomNFTTokenInstance from "../blockchain/contractInstances/CustomNFTTokenInstance";
import "./SingleNFT.css";

const nullAddr = "0x0000000000000000000000000000000000000000";

const SingleNFT = () => {
  const { id } = useParams();
  const [address, tokenId, itemId] = id.split("-");
  const [item, setItem] = useState();
  const [sendTokenValue, setSendTokenValue] = useState();
  const [sendTokenTo, setSendTokenTo] = useState();
  const [listTokenPercentage, setListTokenPercentage] = useState();
  const [listTokenPrice, setListTokenPrice] = useState();
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
    const nftTokenAddr = await MarketplaceInstance.methods
      .nftTokenAddresses(now.itemId)
      .call();
    if (nftTokenAddr != nullAddr) {
      now.partial = true;
      const nftTokenInstance = await CustomNFTTokenInstance(nftTokenAddr);

      const ownersCount = await nftTokenInstance.methods.ownerCount().call();

      const balances = [];
      const lists = [];
      for (let i = 0; i < ownersCount; i++) {
        const owner = await nftTokenInstance.methods.owners(i).call();
        const percentage = await nftTokenInstance.methods
          .balanceOf(owner)
          .call();
        balances.push({
          owner,
          percentage,
        });
        const curList = await MarketplaceInstance.methods
          .tokenList(itemId, owner)
          .call();
        if (curList && curList.percentage != 0) {
          const bids = [];

          const bidsCount = await MarketplaceInstance.methods
            .tokenBidNumber(itemId, owner)
            .call();

          for (let i = 1; i <= bidsCount; i++) {
            const bid = await MarketplaceInstance.methods
              .tokenBids(itemId, owner, i)
              .call();
            bids.push({
              bidder: bid.bidder,
              value: bid.value,
            });
          }

          lists.push({
            lister: owner,
            price: curList.price,
            percentage: curList.percentage,
            bids,
          });
        }
        if (owner == (await web3.eth.requestAccounts())[0])
          now.myNFTOwnership = percentage;
      }
      now.balances = balances;
      now.lists = lists;
      console.log(lists);
    }
    setItem((i) => {
      return { ...i, ...now };
    });
    console.log("updates");
  };

  useEffect(() => {
    (async () => {
      setAddresses(await web3.eth.requestAccounts());
      const nftTokenAddr = await MarketplaceInstance.methods
        .nftTokenAddresses(itemId)
        .call();
      const nftTokenInstance = await CustomNFTTokenInstance(nftTokenAddr);

      if (nftTokenAddr != nullAddr) {
        setItem((i) => {
          return { ...i, partial: true, nftTokenInstance };
        });
      }
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

  const tokenAccessHandler = async (e, list) => {
    if (list) {
      const amount = document.getElementById(list.lister + list.price).value;
      return await tokenParentInstance.methods
        .increaseAllowance(MarketplaceInstance._address, amount)
        .send({ from: addresses[0] });
    }
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

  const partializeHandler = async () => {
    await MarketplaceInstance.methods
      .partializeNFT(itemId)
      .send({ from: addresses[0] });
    updateItem();
  };

  const sendNftTokenHandler = async () => {
    await item.nftTokenInstance.methods
      .transfer(sendTokenTo, sendTokenValue)
      .send({ from: addresses[0] });
  };
  const nftTokenAccessHandler = async () => {
    await item.nftTokenInstance.methods
      .approve(MarketplaceInstance._address, listTokenPercentage)
      .send({ from: addresses[0] });
  };

  const listNftTokenHandler = async () => {
    await MarketplaceInstance.methods
      .listToken(itemId, listTokenPercentage, listTokenPrice)
      .send({ from: addresses[0] });
  };

  const tokenBidHandler = async (e, list) => {
    const lister = e.target.id;
    const amount = document.getElementById(list.lister + list.price).value;
    await MarketplaceInstance.methods
      .bidOnToken(itemId, list.lister, amount)
      .send({ from: addresses[0] });
  };

  const confirmTokenSaleHandler = async () => {
    await MarketplaceInstance.methods
      .confirmTokenSale(itemId, addresses[0])
      .send({ from: addresses[0] });
    updateItem();
  };

  return (
    <>
      {item && (
        <div>
          <p> name: {item?.name}</p>
          <p> itemId : {item?.itemId}</p>
          <p> tokenId : {item?.tokenId}</p>
          <h3> balance : {balance}</h3>
          <p>ownership: {item.partial ? "partial" : "full"} </p>
          {item.myNFTOwnership && <p> my ownership : {item.myNFTOwnership} </p>}
          {!item.partial && <p> owner : {item.owner} </p>}

          {item.lists && (
            <div>
              {item.lists.map((list) => (
                <div key={list.lister}>
                  <p>
                    <b>lister: </b> {list.lister} <b>price :</b> {list.price}
                    <b>percentage :</b> {list.percentage}
                  </p>

                  <div>
                    <h4>bids:</h4>

                    {list.bids &&
                      list.bids.map((bid) => (
                        <div key={bid.bidder}>
                          <p>
                            <b>bidder:</b> {bid.bidder} <b>value:</b>
                            {bid.value}
                          </p>
                        </div>
                      ))}
                  </div>

                  {list.lister == addresses[0] && (
                    <button onClick={confirmTokenSaleHandler}>
                      Confirm Token Sale
                    </button>
                  )}

                  {list.lister != addresses[0] && (
                    <div>
                      <input
                        placeholder="amount"
                        id={list.lister + list.price}
                      ></input>
                      <button
                        onClick={(e) => {
                          tokenAccessHandler(e, list);
                        }}
                        id={list.lister}
                      >
                        Allow token Access
                      </button>
                      <button
                        onClick={(e) => {
                          tokenBidHandler(e, list);
                        }}
                        id={list.lister}
                      >
                        Bid
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {item.partial && (
            <div>
              {item.balances?.map((bal) => (
                <p key={bal.owner}>
                  owner : {bal.owner} percentage : {bal.percentage}
                </p>
              ))}
            </div>
          )}
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
          {!item.partial && item.owner == addresses[0] && (
            <div>
              <input
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="to"
              ></input>
              <button onClick={accessHandler}>Allow Access</button>
              <button onClick={sendHandler}>Send</button>
            </div>
          )}
          {!item.partial && item.owner == addresses[0] && item.sold && (
            <div>
              <input
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="price"
              ></input>
              <button onClick={accessHandler}>Allow Access</button>
              <button onClick={listHandler}>List</button>
            </div>
          )}
          {!item.partial && item.owner != addresses[0] && (
            <div>
              <input
                placeholder="value"
                onChange={(e) => setBidValue(e.target.value)}
              />
              <button onClick={tokenAccessHandler}>allow token access</button>
              <button
                onClick={(e) => {
                  bidHandler(item, addresses);
                }}
              >
                bid
              </button>
            </div>
          )}

          {!item.partial &&
            item.owner == addresses[0] &&
            item.bidNumber > 0 && (
              <div>
                <button onClick={confirmSaleHandler}>
                  Confirm Sale to highest bidder
                </button>
              </div>
            )}
          {!item.partial && item.owner == addresses[0] && (
            <div>
              <button onClick={accessHandler}>Allow Access</button>
              <button onClick={partializeHandler}>Partialize NFT</button>
            </div>
          )}

          {item.myNFTOwnership && (
            <div>
              <input
                placeholder="percentage"
                onChange={(e) => setSendTokenValue(e.target.value)}
              ></input>
              <input
                placeholder="to"
                onChange={(e) => setSendTokenTo(e.target.value)}
              ></input>
              <button onClick={sendNftTokenHandler}>Send</button>
            </div>
          )}

          {/* {
            item.myNFTOwnership && 
          } */}

          {item.myNFTOwnership && (
            <div>
              <input
                placeholder="price"
                onChange={(e) => setListTokenPrice(e.target.value)}
              ></input>
              <input
                placeholder="percentage"
                onChange={(e) => setListTokenPercentage(e.target.value)}
              ></input>
              <button onClick={nftTokenAccessHandler}>Allow Access</button>
              <button onClick={listNftTokenHandler}>List</button>
            </div>
          )}

          <img src={"https://ipfs.io/ipfs/" + item?.image}></img>
        </div>
      )}
    </>
  );
};

export default SingleNFT;
