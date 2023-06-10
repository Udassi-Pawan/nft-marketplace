import { useEffect, useState } from "react";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import web3 from "../blockchain/web3";
import CustomNFTInstance from "../blockchain/contractInstances/CustomNFTInstance";
import { Link } from "react-router-dom";
import Layout, { Header } from "antd/es/layout/layout";
import Navbar from "../components/Navbar";
import { Card, Col } from "antd";
import Meta from "antd/es/card/Meta";
import "./Homepage.css";

const getItem = async function (i) {
  return await MarketplaceInstance.methods.items(i).call();
};

const Homepage = ({ mynfts }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async function () {
      const addresses = await web3.eth.requestAccounts();
      const count = await MarketplaceInstance.methods.itemCount().call();
      console.log(count);

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
          return [...e, now];
          if (mynfts && now.owner == addresses[0]) return [...e, now];
          if (!mynfts && !now.sold) return [...e, now];
          return [...e];
        });
      }
    })();
    return () => {
      setItems([]);
    };
  }, []);

  return (
    <Layout className="homepage-parent">
      <div className="nft-cards">
        {items.map((i) => (
          // <div key={i.image}>
          //   <p>{i.tokenId}</p>
          //   <p>{i.name}</p>
          //   <p>{i.description}</p>
          //   <p>{i.price}</p>
          //   <Link to={"/nft/" + i.nft + "-" + i.tokenId + "-" + i.itemId}>
          //     <img src={"https://ipfs.io/ipfs/" + i.image}></img>
          //   </Link>
          // </div>
          <Link to={"/nft/" + i.nft + "-" + i.tokenId + "-" + i.itemId}>
            <Card
              hoverable
              style={{
                maxWidth: 340,
              }}
              cover={
                <img alt="example" src={"https://ipfs.io/ipfs/" + i.image} />
              }
              bordered={false}
            >
              <Meta title={i.name} description={i.description} />
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Homepage;
