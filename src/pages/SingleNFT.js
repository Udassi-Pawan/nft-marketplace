import { useContext, useEffect, useState } from "react";
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
import Partial from "../components/Partial";
import { MyContext } from "../MyContext";
import bidTokenInstance from "../blockchain/contractInstances/bidTokenInstance";

const nullAddr = "0x0000000000000000000000000000000000000000";

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
  const { setLoading } = useContext(MyContext);

  window.ethereum.on("accountsChanged", async function () {
    setAddresses(await web3.eth.requestAccounts());
    let myBalance;
    if (!item || !item?.partial) return;
    myBalance = await item?.nftTokenInstance?.methods
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
    now.partial = nftTokenAddr != nullAddr;
    if (nftTokenAddr != nullAddr) {
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
          .tokenList(nftTokenInstance._address, owner)
          .call();
        if (curList && curList.percentage != 0) {
          const bids = [];

          const bidsCount = await MarketplaceInstance.methods
            .tokenBidNumber(nftTokenInstance._address, owner)
            .call();

          for (let i = 1; i <= bidsCount; i++) {
            const bid = await MarketplaceInstance.methods
              .tokenBids(nftTokenInstance._address, owner, i)
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
      now.nftTokenInstance = nftTokenInstance;
      console.log(lists);
    }
    setItem((i) => {
      return { ...i, ...now };
    });
    console.log("updates");
  };

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
    updateItem();
    setLoading();
  }

  useEffect(() => {
    (async () => {
      setAddresses(await web3.eth.requestAccounts());
      const nftTokenAddr = await MarketplaceInstance.methods
        .nftTokenAddresses(itemId)
        .call();
      const nftTokenInstance = await CustomNFTTokenInstance(nftTokenAddr);

      setItem((i) => {
        return { ...i, partial: nftTokenAddr != nullAddr, nftTokenInstance };
      });

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

  return (
    <>
      {item && (
        <div className="single">
          <div className="image-modal">
            <div className="info">
              <h1>{item?.name}</h1>
              <p id="desc" className="center">
                {item?.description}
              </p>
              <p>
                <b>Ownership:</b> {item.partial ? "partial" : "full"}{" "}
              </p>
            </div>
            <img src={"https://ipfs.io/ipfs/" + item?.image}></img>
          </div>

          {!item.partial && (
            <>
              <div className="impartial-info flex ">
                <p>
                  <u>
                    <b>Owner:</b> {item.owner}
                  </u>
                </p>
                <p>
                  <b>For Sale?</b> {item.sold ? "No" : "Yes"}
                </p>
                {!item.sold && (
                  <p>
                    <b>Price : </b> {item?.price}
                  </p>
                )}
              </div>

              {item.bids?.length > 0 && (
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
              <h3 className="your-balance">
                <b> Your bidToken Balance: </b>
                {balance}
              </h3>
              <div className="controls center">
                <div className="line long"></div>
                {item.owner == addresses[0] && (
                  <Button
                    onClick={(e) =>
                      smartCall(
                        "methods.setApprovalForAll",
                        NFTInstance,
                        MarketplaceInstance._address,
                        true
                      )
                    }
                  >
                    Allow Access
                  </Button>
                )}
                {item.owner == addresses[0] && item.bidNumber > 0 && (
                  <div className="center">
                    <Button
                      onClick={(e) =>
                        smartCall(
                          "methods.confirmSale",
                          MarketplaceInstance,
                          itemId
                        )
                      }
                    >
                      Confirm Sale to highest bidder
                    </Button>
                  </div>
                )}
                {item.owner == addresses[0] && (
                  <div className="center">
                    <div className="form-item">
                      <Input
                        onChange={(e) => setSendTo(e.target.value)}
                        placeholder="to"
                      ></Input>
                      <Button
                        onClick={async (e) => {
                          if (
                            !(await NFTInstance.methods
                              .isApprovedForAll(
                                item.owner,
                                MarketplaceInstance._address
                              )
                              .call())
                          ) {
                            return alert(
                              "Please allow access to the NFT first!"
                            );
                          }
                          smartCall(
                            "methods.sendNFT",
                            MarketplaceInstance,
                            item.itemId,
                            sendTo
                          );
                        }}
                      >
                        Send
                      </Button>
                    </div>
                    <div className="form-item">
                      <Button
                        onClick={async (e) => {
                          if (
                            !(await NFTInstance.methods
                              .isApprovedForAll(
                                item.owner,
                                MarketplaceInstance._address
                              )
                              .call())
                          ) {
                            return alert(
                              "Please allow access to the NFT first!"
                            );
                          }
                          smartCall(
                            "methods.partializeNFT",
                            MarketplaceInstance,
                            itemId
                          );
                        }}
                      >
                        Partialize NFT
                      </Button>
                    </div>
                  </div>
                )}
                {item.owner == addresses[0] && item.sold && (
                  <div className="form-item">
                    <Input
                      onChange={(e) => setListPrice(e.target.value)}
                      placeholder="price"
                    ></Input>
                    <Button
                      onClick={async (e) => {
                        if (
                          !(await NFTInstance.methods
                            .isApprovedForAll(
                              item.owner,
                              MarketplaceInstance._address
                            )
                            .call())
                        ) {
                          return alert("Please allow access to the NFT first!");
                        }
                        smartCall(
                          "methods.listItem",
                          MarketplaceInstance,
                          item.itemId,
                          listPrice
                        );
                      }}
                    >
                      List on Marketplace
                    </Button>
                  </div>
                )}
                {item.owner != addresses[0] && !item.sold && (
                  <div className="form-item">
                    <Input
                      placeholder="Value"
                      onChange={(e) => setBidValue(e.target.value)}
                    />
                    <Button
                      onClick={async (e) => {
                        if (
                          (await tokenParentInstance.methods
                            .balanceOf(addresses[0])
                            .call()) < bidValue
                        )
                          return alert(
                            "Please get enough bidTokens to bid on item."
                          );
                        smartCall(
                          "methods.approve",
                          tokenParentInstance,
                          MarketplaceInstance._address,
                          bidValue
                        );
                      }}
                    >
                      Allow Token Access
                    </Button>
                    <Button
                      onClick={async (e) => {
                        if (
                          (await tokenParentInstance.methods
                            .balanceOf(addresses[0])
                            .call()) < bidValue
                        )
                          return alert(
                            "Please get enough bidTokens to bid on item."
                          );
                        if (
                          (await tokenParentInstance.methods
                            .allowance(
                              addresses[0],
                              MarketplaceInstance._address
                            )
                            .call()) < bidValue
                        )
                          return alert(
                            "Please allow access to bidTokens to bid on item."
                          );
                        smartCall(
                          "methods.bidItem",
                          MarketplaceInstance,
                          itemId,
                          bidValue
                        );
                      }}
                    >
                      Bid
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          <Partial
            item={item}
            addresses={addresses}
            balance={balance}
            updateItem={updateItem}
          ></Partial>
        </div>
      )}
    </>
  );
};

export default SingleNFT;
