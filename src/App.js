import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CreateNFT from "./pages/CreateNFT";
import Homepage from "./pages/Homepage";
import SingleNFT from "./pages/SingleNFT";
import Tokens from "./pages/Tokens";

function App() {
  return (
    <Routes>
      <Route path="/create" element={<CreateNFT />} />
      <Route path="/mynfts" element={<Homepage mynfts={true} />} />
      <Route path="/" element={<Homepage mynfts={false} />} />
      <Route path="/nft/:id" element={<SingleNFT />} />
      <Route path="/tokens" element={<Tokens />} />
    </Routes>
  );
}

export default App;
