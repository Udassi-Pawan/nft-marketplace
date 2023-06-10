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
import { Button, Card, Input } from "antd";

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
    const myBalance = await item?.nftTokenInstance?.methods
      .balanceOf(addresses[0])
      .call();
    setItem((i) => {
      return { ...i, myNFTOwnership: myBalance };
    });
  });

  const updateItem = async () => {
    const now = await MarketplaceInstance.methods.items(itemId).call();
    addresses &&
      setBalance(
        await tokenParentInstance.methods.balanceOf(addresses[0]).call()
      );
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
        if (!balances.find((el) => el.owner == owner)) {
          balances.push({
            owner,
            percentage,
          });
        }
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

          if (!lists.find((l) => l.lister == owner)) {
            lists.push({
              lister: owner,
              price: curList.price,
              percentage: curList.percentage,
              bids,
            });
          }
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
    updateItem();
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
    updateItem();
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
    updateItem();
  };

  const tokenBidHandler = async (e, list) => {
    const lister = e.target.id;
    const amount = document.getElementById(list.lister + list.price).value;
    await MarketplaceInstance.methods
      .bidOnToken(itemId, list.lister, amount)
      .send({ from: addresses[0] });
    updateItem();
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
        <div className="single">
          <div className="image-modal">
            <div className="info">
              <p>
                <b>Name:</b> {item?.name}
              </p>
              <p id="desc">
                <b>About:</b> {item?.description}
              </p>
              <p>
                <b>Ownership:</b> {item.partial ? "partial" : "full"}{" "}
              </p>
            </div>
            <img src={"https://ipfs.io/ipfs/" + item?.image}></img>
          </div>

          {!item.partial && (
            <>
              <p>
                <b>Owner:</b> {item.owner}
              </p>
              {/* <h3> Your balance : {balance}</h3> */}
              <p>
                <b>For Sale?</b> {item.sold ? "No" : "Yes"}
              </p>
              {!item.sold && (
                <p>
                  <b>Price : </b> {item?.price}
                </p>
              )}

              {item.bids && (
                <div className="full-bids">
                  <h2>Bids:</h2>
                  {item.bids?.map((bid, ind) => (
                    <div key={ind}>
                      <p>
                        <b>Bidder:</b> {bid.bidder} <b>Value:</b> {bid.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="controls">
                {item.owner == addresses[0] && item.bidNumber > 0 && (
                  <div className="center">
                    <Button onClick={confirmSaleHandler}>
                      Confirm Sale to highest bidder
                    </Button>
                  </div>
                )}
                {item.owner == addresses[0] && (
                  <>
                    <div className="form-item">
                      <Input
                        onChange={(e) => setSendTo(e.target.value)}
                        placeholder="to"
                      ></Input>
                      <Button onClick={accessHandler}>Allow Access</Button>
                      <Button onClick={sendHandler}>Send</Button>
                    </div>
                    <div className="form-item center">
                      <Button onClick={accessHandler}>Allow Access</Button>
                      <Button onClick={partializeHandler}>
                        Partialize NFT
                      </Button>
                    </div>
                  </>
                )}
                {item.owner == addresses[0] && item.sold && (
                  <div className="form-item">
                    <Input
                      onChange={(e) => setListPrice(e.target.value)}
                      placeholder="price"
                    ></Input>
                    <Button onClick={accessHandler}>Allow Access</Button>
                    <Button onClick={listHandler}>List</Button>
                  </div>
                )}
                {item.owner != addresses[0] && !item.sold && (
                  <div className="form-item">
                    <Input
                      placeholder="Value"
                      onChange={(e) => setBidValue(e.target.value)}
                    />
                    <Button onClick={tokenAccessHandler}>
                      Allow Token Access
                    </Button>
                    <Button
                      onClick={(e) => {
                        bidHandler(item, addresses);
                      }}
                    >
                      Bid
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {item.partial && (
            <>
              <h2>Owners:</h2>
              {item.myNFTOwnership && (
                <p> my ownership : {item.myNFTOwnership} </p>
              )}
              <div>
                {item.balances?.map((bal) =>
                  bal.percentage > 0 && bal.owner != addresses[0] ? (
                    <p p key={bal.owner}>
                      owner : {bal.owner} percentage : {bal.percentage}
                    </p>
                  ) : (
                    ""
                  )
                )}
              </div>
              <div className="line long"></div>
              <h2>Listings for Sale</h2>
              {item.lists && (
                <div>
                  {item.lists.map((list) => (
                    <div key={list.lister} className="list center">
                      <p>
                        <b>lister: </b> {list.lister} <b>price :</b>{" "}
                        {list.price}
                        <b>percentage :</b> {list.percentage}
                      </p>

                      <div className="center">
                        <div>
                          <h3>bids:</h3>
                        </div>
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

                      {list.lister == addresses[0] && (
                        <Button onClick={confirmTokenSaleHandler}>
                          Confirm Token Sale
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item.myNFTOwnership > 0 && (
                <>
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
                    <Button onClick={nftTokenAccessHandler}>
                      Allow Access
                    </Button>
                    <Button onClick={listNftTokenHandler}>List</Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SingleNFT;
