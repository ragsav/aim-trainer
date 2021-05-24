import { RedoOutlined } from "@ant-design/icons";
const GravityResults = (props) => {
  const { data } = props;

  if (data) {
    let totalTargets = 0;
    let hits = 0;
    let time = data.targets[0] ? data.finishTime - data.targets[0].birth : 0;
    let accuracy = 0; // hits/totalTargets

    let responseTime = 0;
    let speed = 0; // hits/time

    data.targets.forEach((target) => {
      if (target.birth < data.finishTime) {
        totalTargets++;
        if (target.isClicked) {
          hits++;
          responseTime = responseTime + target.clickedTime - target.birth;
        }
      }
    });

    responseTime = totalTargets === 0 ? 0 : responseTime / totalTargets;

    accuracy = totalTargets === 0 ? 0 : (hits / totalTargets) * 100;
    speed = time === 0 ? 0 : (hits / time) * 1000;

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
          <div className="d-flex justify-content-between align-items-center mt-4 w-100 ">
            <span>Hits</span>
            <span>{hits}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1 w-100">
            <span>Miss</span>
            <span>{totalTargets - hits}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1 w-100">
            <span>Accuracy</span>
            <span>{Math.round(accuracy * 100) / 100} %</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-1 w-100">
            <span>Avg response time</span>
            <span>{Math.round(responseTime * 1000) / 1000} ms</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1 w-100">
            <span>Speed</span>
            <span>{Math.round(speed * 100) / 100} targets/sec</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1 mb-4 w-100">
            <span>Time</span>
            <span>{time / 1000} sec</span>
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
  } else {
    return <div></div>;
  }
};

export default GravityResults;
