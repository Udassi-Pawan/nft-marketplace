import { useState } from "react";
import { create as ipfsClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import NFTInstance from "../blockchain/contractInstances/NFTInstance";
import web3 from "../blockchain/web3";
import MarketplaceInstance from "../blockchain/contractInstances/MarketplaceInstance";
import Navbar from "../components/Navbar";
import { Button, Col, Form, Input, Layout, Modal, Row, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./CreateNFT.css";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const projectId = process.env.REACT_APP_PROJECT_KEY;
const projectSecret = process.env.REACT_APP_PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const CreateNFT = () => {
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [description, setDescription] = useState();
  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList && newFileList[0]) setImage(newFileList[0].originFileObj);
    else setImage();
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const createHandler = async () => {
    // return console.log(name, description);
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
    const imageIpfsAddress = `${result1.path}`;
    const result2 = await client.add(
      JSON.stringify({ image: imageIpfsAddress, name, description })
    );
    const nftIpfsAddress = `${result2.path}`;
    const madeItem = await MarketplaceInstance.methods
      .makeItem(NFTInstance._address, nftIpfsAddress)
      .send({ from: addresses[0] });
    console.log(madeItem);
  };

  return (
    <div className="create-parent">
      <h2>Enter name, description and image of nft to mint. </h2>
      <Form.Item
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input name for NFT!",
          },
        ]}
      >
        <Input
          className="form-input"
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input
          className="form-input"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Item>

      <div>
        <Upload
          listType="picture-card"
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {image == null ? uploadButton : null}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </div>

      <Button type="primary" onClick={createHandler}>
        Create NFT
      </Button>
    </div>
  );
};

export default CreateNFT;
