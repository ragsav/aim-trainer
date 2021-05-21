import { useEffect, useRef, useState } from "react";
import { TargetFull } from "./targetFull";
import { Vector } from "./vector";
import "./challengeArena.css";
function clearCanvas(ctx, canvasRef) {
  ctx?.clearRect(
    0,
    0,
    canvasRef?.current?.clientWidth,
    canvasRef?.current?.clientHeight
  );
}

function die(targets) {
  for (let i = 0; i < targets.current.length; i++) {
    if (targets.current[i].canDie()) {
      targets.current.splice(i, 1);
    }
  }
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
  const gameLoops = useRef(0);
  const speedRef = useRef(0.5);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(playingRef.current);
  const TARGETS = useRef([]);

  // useEffect(() => {
  //   speedRef.current = speed;
  // }, [speed]);

  useEffect(() => {
    console.log("inside use ref");
    if (canvasRef && canvasRef.current) {
      console.log({ canvasRef });
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      canvasRef.current.focus();
      setCtx(ctx);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ctx) {
      clearCanvas(ctx, canvasRef);
      mainLoop();
    }
  }, [ctx]);

  // useEffect(() => {
  //   let reqID = null;
  //   statusRef.current = status;
  //   if (status.localeCompare("Playing") === 0) {
  //     reqID = requestAnimationFrame(mainLoop);
  //   }
  //   return () => {
  //     if (reqID) {
  //       cancelAnimationFrame(reqID);
  //     }
  //   };
  // }, [status]);

  useEffect(() => {
    if (playing) {
      startTimeRef.current = Date.now();
    } else {
      gameLoops.current = 0;
    }
  }, [playing]);

  useEffect(() => {
    let reqID = null;

    console.log(playingRef.current);
    if (ctx && playing) {
      reqID = requestAnimationFrame(mainLoop);
    }
    return () => {
      if (reqID) {
        cancelAnimationFrame(reqID);
      }
    };
  }, [ctx, playing]);

  function addTarget(targets) {
    const x = 20 + Math.random() * (canvasRef.current.clientWidth - 40);
    const y = 20 + Math.random() * (canvasRef.current.clientHeight - 40);
    const target = new TargetFull(x, y, 20, targets, 1, 0.5);
  }

  function mainLoop(timestamp) {
    // console.log("running");

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
    }

    requestAnimationFrame(mainLoop);
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
      ></div>
      <div
        style={{
          height: window.innerHeight - 50,
          width: window.innerWidth,
          padding: 20,
        }}
      >
        <canvas
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
