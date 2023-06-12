import { Menu } from "antd";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useState } from "react";
const items = [
  {
    label: (
      <Link key="/home" to="/home">
        Marketplace
      </Link>
    ),
    key: "/home",
  },
  {
    label: (
      <Link key="mynfts" to="/mynfts">
        {" "}
        My NFTs{" "}
      </Link>
    ),
    key: "/mynfts",
  },
  {
    label: (
      <Link key="/create" to="/create">
        Create New
      </Link>
    ),
    key: "/create",
  },
  {
    label: (
      <Link key="/tokens" to="/tokens">
        bidTokens
      </Link>
    ),
    key: "/tokens",
  },
];
const Navbar = () => {
  const url = window.location.pathname;
  console.log(url);
  const [visible, setVisible] = useState(false);

  const centerStyle = {
    position: "relative",
    display: "block",
    width: "100%",
    backgroundColor: "inherit",
  };
  return (
    <div className="navbar-parent">
      <div className="menu">
        <Menu
          style={centerStyle}
          items={items}
          defaultSelectedKeys={[url]}
          mode="horizontal"
          overflowedIndicator={<p>Menu</p>}
        />
      </div>
    </div>
  );
};
export default Navbar;
