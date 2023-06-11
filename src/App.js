import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CreateNFT from "./pages/CreateNFT";
import Homepage from "./pages/Homepage";
import SingleNFT from "./pages/SingleNFT";
import Tokens from "./pages/Tokens";
import Layout, { Content, Header } from "antd/es/layout/layout";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { MyContext } from "./MyContext";
import { useState } from "react";
function App() {
  const [loading, setLoading] = useState();
  return (
    <MyContext.Provider value={{ loading, setLoading }}>
      <Layout
        style={{ width: "100%", height: "100vh", boxSizing: "border-box" }}
      >
        <LoadingSpinner>
          <Header style={{ backgroundColor: "inherit" }}>
            <Navbar></Navbar>
          </Header>
          <Content>
            <Routes>
              <Route path="/create" element={<CreateNFT />} />
              <Route path="/mynfts" element={<Homepage mynfts={true} />} />
              <Route path="/" element={<Homepage mynfts={false} />} />
              <Route path="/nft/:id" element={<SingleNFT />} />
              <Route path="/tokens" element={<Tokens />} />
            </Routes>
          </Content>
        </LoadingSpinner>
      </Layout>
    </MyContext.Provider>
  );
}

export default App;
