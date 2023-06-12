import { useContext, CSSProperties, useState } from "react";
import { DotLoader, PuffLoader } from "react-spinners";
import { MyContext } from "../MyContext";
import Navbar from "../components/Navbar";
import Layout, { Content, Header } from "antd/es/layout/layout";

const override: CSSProperties = {
  position: "absolute",
  left: "45%",
  top: "40%",
};

const LoadingSpinner = ({ children }) => {
  const { loading, setLoading } = useContext(MyContext);
  return (
    <>
      <Layout
        style={{ width: "100%", height: "100vh", boxSizing: "border-box" }}
      >
        <Header style={{ backgroundColor: "inherit" }}>
          <Navbar></Navbar>
        </Header>
        <Content>
          {loading ? (
            <PuffLoader color={"skyblue"} cssOverride={override} size={120} />
          ) : (
            <> {children} </>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default LoadingSpinner;
