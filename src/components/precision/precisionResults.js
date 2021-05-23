import { RedoOutlined } from "@ant-design/icons";
const PrecisionResults = (props) => {
  const { data } = props;

  return (
    <div
      style={{
        position: "absolute",
        width: props.width,
        height: props.height,
        backgroundColor: "#FFFFFF26",
        color: "white",
        fontSize: "large",
        fontWeight: "700",
        zIndex: 2,
      }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div
        className="d-flex flex-column justify-content-start align-items-center "
        style={{ width: 300 }}
      >
        <div className="mb-2" style={{ fontSize: "x-large" }}>
          Game over
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4 w-100 mb-1 ">
          <span>Precision </span>
          <span>{props.precision}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100 mb-3 ">
          <span>Hits </span>
          <span>{props.hits}</span>
        </div>

        <button
          onClick={props.startGame}
          className=" btn core-button py-2 px-3"
        >
          <div className="d-flex  justify-content-center align-items-center">
            <RedoOutlined style={{ fontSize: 36 }} />
            <span className="ml-2">RESTART</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PrecisionResults;
