import { useEffect, useRef, useState } from "react";
import { TargetFull } from "./targetFull";
import { Vector } from "./vector";
import "./challengeArena.css";
import LifeIndicator from "./lifeIndicator";
import Countdown from "antd/lib/statistic/Countdown";
import CountDownTimer from "./countDownTimer";
import { Button } from "antd";



const Results = (props) =>{
  const {data} = props;


  if(data){
    let totalTargets = 0;
    let hits = 0;
    let time = data.finishTime - data.targets[0].birth;
    let accuracy = 0; // hits/totalTargets
    let precision = 0;
    let speed = 0; // hits/time

    data.targets.forEach((target) => {
      if (target.birth < data.finishTime) {
        totalTargets++;
        if (target.isClicked) {
          hits++;
          precision =
            precision + target.pos.subtr(target.clickPos).mag() / target.r;
        }
      }
    });

    precision = hits===0?0:(precision / hits) * 100;
    accuracy = (hits / totalTargets) * 100;
    speed = (hits / time) * 1000;

    
    return (
      <div
        className="d-flex flex-column justify-content-start align-items-center m-2"
        style={{ width: 300 }}
      >
        <div className="d-flex justify-content-between align-items-center mt-1 w-100">
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
          <span>Precision</span>
          <span>{Math.round(precision * 100) / 100} %</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1 w-100">
          <span>Speed</span>
          <span>{Math.round(speed * 100) / 100} targets/sec</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1 w-100">
          <span>Time</span>
          <span>{time / 1000} sec</span>
        </div>
      </div>
    );
  }else{
    return <div></div>
  }
}
function clearCanvas(ctx, canvasRef) {
  ctx?.clearRect(
    0,
    0,
    canvasRef?.current?.clientWidth,
    canvasRef?.current?.clientHeight
  );
}


const boundaries = {
  left: 20,
  top: 120,
  right: window.innerWidth - 20,
  bottom: window.innerHeight - 20,
};

const ChallengeArena = () => {
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [lifes, setlifes] = useState(5);
  const lifesRef = useRef(5);
  const gameLoops = useRef(0);
  const speedRef = useRef(0.5);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(playingRef.current);

  const [gameStarted, setGameStarted] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const TARGETS = useRef([]);
  const data = useRef({totalTargets:0,targets:[],finishTime:null});

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      console.log({ canvasRef });
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      canvasRef.current.focus();
      setCtx(ctx);
    }
  }, [canvasRef]);

  useEffect(() => {
    let reqID = null;
    if (ctx && playing) {
      console.log("playing....");
      setIsCountDown(true);
      setTimeout(() => {
        console.log("started....");
        setIsCountDown(false);
        reqID = requestAnimationFrame(mainLoop);
      }, 5500);

      return () => {
        if (reqID) {
          cancelAnimationFrame(reqID);
        }
      };
    }
  }, [ctx, playing]);

  function startGame() {
    if (!gameStarted) {
      setGameStarted(true);
    }
    clearCanvas(ctx, canvasRef);
    setPlaying(true);
    setIsCountDown(true);
    setlifes(5);
    gameLoops.current = 0;
    startTimeRef.current = Date.now();
    lifesRef.current = 5;
    TARGETS.current = [];
    playingRef.current = true;
  }

  function finishGame() {
    setPlaying(false);
    playingRef.current = false;
    console.log(data.current.targets);
  }

  function decreaseLife() {
    lifesRef.current = lifesRef.current - 1;
    console.log(lifesRef.current);
    setlifes(lifesRef.current);
  }

  function addTarget(targets) {
    if (canvasRef && canvasRef.current) {
      const x = 20 + Math.random() * (canvasRef.current.clientWidth - 40);
      const y = 20 + Math.random() * (canvasRef.current.clientHeight - 40);
      const target = new TargetFull(x, y, 20, targets,  data, 1, 0.5);
      data.current.totalTargets = data.current.totalTargets  +  1;
    }
  }

  function die(targets) {
    for (let i = 0; i < targets.current.length; i++) {
      if (targets.current[i].canDie()) {
        if (!targets.current[i].isClicked) {
          decreaseLife();
          if (lifesRef.current === 0) {
            data.current.finishTime = Date.now();
            finishGame();
          }
        }
        targets.current.splice(i, 1);
      }
    }
  }

  function mainLoop(timestamp) {
    if (playingRef.current) {
      clearCanvas(ctx, canvasRef);
      die(TARGETS);
      let spwanBuffer = 800;
      if (gameLoops.current * 100 < 2000 - spwanBuffer) {
        spwanBuffer = 2000 - gameLoops.current * 100;
      }
      if (Date.now() > startTimeRef.current + spwanBuffer) {
        addTarget(TARGETS);
        startTimeRef.current = Date.now();
        gameLoops.current = gameLoops.current + 1;
      }
      TARGETS.current.forEach((b, index) => {
        b.updateCreature(ctx, boundaries);
      });
      requestAnimationFrame(mainLoop);
    } else {
      return;
    }
  }

  function handleCanvasClick(e) {
    const mouse = new Vector(e.clientX - 40, e.clientY - 70);
    const targets = TARGETS.current;
    for (let i = 0; i < targets.length; i++) {
      if (
        targets[i].pos.subtr(mouse).mag() < targets[i].orignalR &&
        targets[i].isActive
      ) {
        targets[i].isClicked = true;
        targets[i].clickedTime = Date.now();
        targets[i].clickPos = mouse;
      }
    }
  }
  function handleKeyDown(e) {
    if (e.keyCode === 32) {
      console.log("space key pressed");
      finishGame();
    }
  }

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="d-flex flex-column"
    >
      <div
        style={{ height: 50, width: window.innerWidth }}
        className="d-flex justify-content-between align-items-center px-5"
      >
        <LifeIndicator value={lifes} />
      </div>
      <div
        style={{
          height: window.innerHeight - 50,
          width: window.innerWidth,
          padding: 20,
          position: "relative",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        {!gameStarted ? (
          <div
            style={{
              position: "absolute",
              width: window.innerWidth - 80,
              height: window.innerHeight - 90,
              backgroundColor: "#FFFFFF72",
              color: "white",
              fontSize: "large",
              fontWeight: "700",
            }}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <Button type="dashed" onClick={startGame}>
              Play
            </Button>
          </div>
        ) : !playing ? (
          <div
            style={{
              position: "absolute",
              width: window.innerWidth - 80,
              height: window.innerHeight - 90,
              backgroundColor: "#FFFFFF72",
              color: "white",
              fontSize: "large",
              fontWeight: "700",
            }}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <div className="mb-2">Game over</div>
            <Results data = {data.current}/>
            <Button type="dashed" onClick={startGame}>
              Restart
            </Button>
          </div>
        ) : null}

        {isCountDown ? (
          <div
            style={{
              position: "absolute",
              width: window.innerWidth - 80,
              height: window.innerHeight - 90,
              backgroundColor: "#FFFFFF72",
              color: "white",
              fontSize: "large",
              fontWeight: "700",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            <CountDownTimer />
          </div>
        ) : null}
        <canvas
          style={{ position: "absolute" }}
          className="canvas"
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          tabIndex={1}
          id="canvas"
          ref={canvasRef}
          width={window.innerWidth - 80}
          height={window.innerHeight - 90}
          style={{ backgroundColor: "#1B1B1B" }}
        ></canvas>
      </div>
    </div>
  );
};

export default ChallengeArena;
