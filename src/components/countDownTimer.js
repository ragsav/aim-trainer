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
        color: "white",
        fontSize: "large",
        fontWeight: "700",
      }}
    >
      {countDown}
    </div>
  );
};

export default CountDownTimer;
