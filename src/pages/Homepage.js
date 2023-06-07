import { useEffect, useState } from "react";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import web3 from "../blockchain/web3";
import CustomNFTInstance from "../blockchain/contractInstances/CustomNFTInstance";
import { Link } from "react-router-dom";

const getItem = async function (i) {
  return await MarketplaceInstance.methods.items(i).call();
};

const Homepage = ({ mynfts }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async function () {
      const addresses = await web3.eth.requestAccounts();
      const count = await MarketplaceInstance.methods.itemCount().call();
      for (let i = 0; i < count; i++) {
        let now = await getItem(i);
        const curNFTInstance = CustomNFTInstance(now.nft);
        let curNFTUriLoc = await curNFTInstance.methods
          .tokenURI(now.tokenId)
          .call();
        curNFTUriLoc = "https://ipfs.io/ipfs/" + curNFTUriLoc;
        let nftUri = await fetch(curNFTUriLoc);
        nftUri = await nftUri.json();
        const { name, image, description } = nftUri;
        now = { ...now, name, image, description };
        setItems((e) => {
          if (mynfts && now.owner != addresses[0]) {
            return [...e];
          }
          return [...e, now];
        });
      }
    })();
    return () => {
      setItems([]);
    };
  }, []);

  console.log(items);

  return (
    <div>
      {items.map((i) => (
        <div key={i.image}>
          <p>{i.tokenId}</p>
          <p>{i.name}</p>
          <p>{i.description}</p>
          <Link to={"/nft/" + i.nft + "-" + i.tokenId + "-" + i.itemId}>
            <img src={"https://ipfs.io/ipfs/" + i.image}></img>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
