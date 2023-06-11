import { Menu } from "antd";
import { Link } from "react-router-dom";
import "./Navbar.css";

const items = [
  { label: <Link to="/">Marketplace</Link>, key: "/" },
  { label: <Link to="/create">Create New</Link>, key: "/create" },
  { label: <Link to="/tokens">bidTokens</Link>, key: "/tokens" },
];

const Navbar = () => {
  const url = window.location.pathname;
  console.log(url);

  const centerStyle = {
    position: "relative",
    display: "block",
    // justifyContent: "center",
    width: "100%",
    backgroundColor: "inherit",
  };
  return (
    <div className="navbar-parent">
      <div className="menu">
        <Menu style={centerStyle} defaultSelectedKeys={[url]} mode="horizontal">
          <Menu.Item key="finance">
            <Link to="/create"> Create </Link>
          </Menu.Item>
          <Menu.Item key="/">
            <Link to="/"> Marketplace </Link>
          </Menu.Item>
          <Menu.Item key="/mynfts">
            <Link to="/mynfts"> My NFTs </Link>
          </Menu.Item>
          <Menu.Item key="/tokens" style={{ justifySelf: "end" }}>
            <Link to="/tokens"> Tokens </Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};
export default Navbar;
