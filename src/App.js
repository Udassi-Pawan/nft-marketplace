import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import CreateNFT from "./pages/CreateNFT";
import Homepage from "./pages/Homepage";
import SingleNFT from "./pages/SingleNFT";
import Tokens from "./pages/Tokens";
import Layout, { Content, Header } from "antd/es/layout/layout";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { MyContext } from "./MyContext";
import { useState } from "react";
import StartPage from "./pages/StartPage";
import { Switch } from "antd";
function App() {
  const [loading, setLoading] = useState();
  return (
    <MyContext.Provider value={{ loading, setLoading }}>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/create" element={<CreateNFT />} />
        <Route path="/mynfts" element={<Homepage mynfts={true} />} />
        <Route path="/home" element={<Homepage mynfts={false} />} />
        <Route path="/nft/:id" element={<SingleNFT />} />
        <Route path="/tokens" element={<Tokens />} />
      </Routes>
    </MyContext.Provider>
  );
}

export default App;
