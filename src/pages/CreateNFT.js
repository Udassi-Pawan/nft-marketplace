import { useState } from "react";
import { create as ipfsClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import NFTInstance from "../blockchain/contractInstances/NFTInstance";
import web3 from "../blockchain/web3";

const projectId = process.env.REACT_APP_PROJECT_KEY;
const projectSecret = process.env.REACT_APP_PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const CreateNFT = () => {
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [description, setDescription] = useState();

  const createHandler = async () => {
    const addresses = await web3.eth.requestAccounts();
    const client = await ipfsClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    });
    // if (name || image || description) return alert("Please fill empty fields!");
    const result1 = await client.add(image);
    const imageIpfsAddress = result1.path;

    const result2 = await client.add(
      JSON.stringify({ image: imageIpfsAddress, name, description })
    );
    const nftIpfsAddress = `https://gateway.pinata.cloud/ipfs/${result2.path}`;
    console.log(result1);
    console.log(result2);
    console.log(addresses);
    const result3 = await NFTInstance.methods
      .mintTo(addresses[0], nftIpfsAddress)
      .send({ from: addresses[0] });
    console.log(result3);
  };

  return (
    <div>
      <input onChange={(e) => setImage(e.target.files[0])} type="file"></input>
      <input
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      ></input>
      <input
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      ></input>
      <button onClick={createHandler}>Create NFT</button>
    </div>
  );
};

export default CreateNFT;
