import { useEffect, useRef, useState } from "react";
import { TargetFull } from "./targetFull";
import { Vector } from "./vector";
import "./challengeArena.css";
import LifeIndicator from "./lifeIndicator";
import Countdown from "antd/lib/statistic/Countdown";
import CountDownTimer from "./countDownTimer";
function clearCanvas(ctx, canvasRef) {
  ctx?.clearRect(
    0,
    0,
    canvasRef?.current?.clientWidth,
    canvasRef?.current?.clientHeight
  );
}



function getInActive(targets) {}

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
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(playingRef.current);
  const gameOverRef = useRef(false);
  const [gameOver,setGameOver] = useState(false);
  const [isCountDown,setIsCountDown] = useState(false);
  const TARGETS = useRef([]);


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
    if (playing) {
      startTimeRef.current = Date.now();
      setGameOver(false);
    } else {
      gameLoops.current = 0;
    }
  }, [playing]);



  useEffect(() => {
    let reqID = null;

    console.log(playingRef.current);
    if (ctx && playing && !gameOver) {
      console.log("playing....")
      setIsCountDown(true);
      setTimeout(()=>{
        console.log("started....")
        setIsCountDown(false);
        reqID = requestAnimationFrame(mainLoop);
      },5500)
      
      return () => {
        if (reqID) {
          cancelAnimationFrame(reqID);
        }
      };
    }
    
  }, [ctx, playing]);

  function addTarget(targets) {
    if   (canvasRef   &&   canvasRef.current)   {
      const x = 20 + Math.random() * (canvasRef.current.clientWidth - 40);
      const y = 20 + Math.random() * (canvasRef.current.clientHeight - 40);
      const target = new TargetFull(x, y, 20, targets, 1, 0.5);
    }
  }

  function die(targets) {
    for (let i = 0; i < targets.current.length; i++) {
      if (targets.current[i].canDie()) {
        if (!targets.current[i].isClicked) {
          
          lifesRef.current = lifesRef.current-1;
          console.log(lifesRef.current);
          setlifes(lifesRef.current);
          if(lifesRef.current===0){
            gameOverRef.current = true;
            setGameOver(true);
          }
        }
        targets.current.splice(i, 1);
      }
    }
  }

  function mainLoop(timestamp) {
    // console.log("running");

    if (playingRef.current&&!gameOverRef.current) {
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
    }else{
      return;
    }

    
  }

  function handleCanvasClick(e) {
    const mouse = new Vector(e.clientX - 20, e.clientY - 70);
    const targets = TARGETS.current;
    for (let i = 0; i < targets.length; i++) {
      if (
        targets[i].pos.subtr(mouse).mag() < targets[i].orignalR &&
        targets[i].isActive
      ) {
        targets[i].isClicked = true;
        targets[i].clickedTime = Date.now();
      }
    }
  }
  function handleKeyDown(e) {
    if (e.keyCode === 32) {
      console.log("space");
      playingRef.current = !playingRef.current;
      setPlaying(!playing);
    }
  }
  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="d-flex flex-column"
    >
      <div
        style={{ height: 50, width: window.innerWidth }}
        className="d-flex justify-content-between align-items-center px-4"
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
      >
        {gameOver ? (
          <div
            style={{
              position: "absolute",
              width: window.innerWidth - 40,
              height: window.innerHeight - 90,
              backgroundColor: "#FFFFFF72",
              color: "white",
              fontSize: "large",
              fontWeight: "700",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            Game over
          </div>
        ) : null}
        {isCountDown ? (
          <div
            style={{
              position: "absolute",
              width: window.innerWidth - 40,
              height: window.innerHeight - 90,
              backgroundColor: "#FFFFFF72",
              color: "white",
              fontSize: "large",
              fontWeight: "700",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            <CountDownTimer/>
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
          width={window.innerWidth - 40}
          height={window.innerHeight - 90}
          style={{ backgroundColor: "#222222" }}
        ></canvas>
      </div>
    </div>
  );
};

export default ChallengeArena;
