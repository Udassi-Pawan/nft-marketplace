import { useContext, CSSProperties } from "react";
import { DotLoader, PuffLoader } from "react-spinners";
import { MyContext } from "../MyContext";

const override: CSSProperties = {
  position: "absolute",
  left: "45%",
  top: "40%",
};

const LoadingSpinner = ({ children }) => {
  const { loading } = useContext(MyContext);
  return (
    <>
      {loading ? (
        <PuffLoader color={"skyblue"} cssOverride={override} size={120} />
      ) : (
        <> {children} </>
      )}
    </>
  );
};

export default LoadingSpinner;
