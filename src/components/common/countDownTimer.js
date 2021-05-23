import { useState } from "react";
import { useEffect } from "react";

const CountDownTimer = (props) => {
  const [countDown, setCountDown] = useState(5);
  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    }
  }, [countDown]);
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
      className="d-flex justify-content-center align-items-center"
    >
      <div
        style={{
          color: "white",
          fontSize: "large",
          fontWeight: "700",
        }}
      >
        {countDown}
      </div>
    </div>
  );
};

export default CountDownTimer;
