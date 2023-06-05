import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import CreateNFT from "./pages/CreateNFT";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateNFT />} />
    </Routes>
  );
}

export default App;
