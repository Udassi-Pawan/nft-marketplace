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
        <Route path="/" index element={<StartPage />} />
        <Route path="/create" index element={<CreateNFT />} />
        <Route path="/mynfts" index element={<Homepage mynfts={true} />} />
        <Route path="/home" index element={<Homepage mynfts={false} />} />
        <Route path="/nft/:id" index element={<SingleNFT />} />
        <Route path="/tokens" index element={<Tokens />} />
      </Routes>
    </MyContext.Provider>
  );
}

export default App;
