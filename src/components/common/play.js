import { PlayCircleFilled } from "@ant-design/icons";
const Play = (props) => {
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
      <button onClick={props.startGame} className=" btn core-button py-2 px-3">
        <div className="d-flex  justify-content-center align-items-center">
          <PlayCircleFilled style={{ fontSize: 36 }} />
          <span className="ml-2">PLAY</span>
        </div>
      </button>
      <span
        style={{
          fontSize: "small",
          fontWeight: "500",
          zIndex: 2,
        }}
        className="mt-4 text"
      >
        Press (SPACE) or (ESC) to finish training
      </span>
    </div>
  );
};

export default Play;
