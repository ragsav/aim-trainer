import { PlayCircleFilled } from "@ant-design/icons";
const Play = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        width: window.innerWidth - 80,
        height: window.innerHeight - 90,
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
    </div>
  );
};

export default Play;
