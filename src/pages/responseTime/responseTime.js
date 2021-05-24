import { useEffect, useRef, useState } from "react";
import { TargetFull } from "../../classes/targetFull";
import { Vector } from "../../classes/vector";
import "./responseTime.css";
import CountDownTimer from "../../components/common/countDownTimer";
import Play from "../../components/common/play";
import ResponseTimeNavBar from "../../components/responseTime/responseTimeNabar";
import ResponseTimeResults from "../../components/responseTime/responseTimeResults";
import ResponseTimeSettings from "../../components/responseTime/responseTimeSettings";
import Modal from "antd/lib/modal/Modal";
import gunshot from "../../assets/sounds/shotgun.mp3";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
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

const ResponseArena = () => {
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [isSoundOn, setIsSoundOn] = useState(true);
  const gunshotRef = useRef(null);
  const gunReloadRef = useRef(null);
  const gameLoops = useRef(0);

  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(playingRef.current);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const [isCenterPlacement, setIsCenterPlacement] = useState(false);
  const totalTargetsRef = useRef(0);

  const [responseTime, setResponseTime] = useState(0);
  const TARGETS = useRef([]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isSettingsOpen && playing) {
      finishGame();
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      console.log({ canvasRef });
      const canvas = document.getElementById("canvas");
      canvas.focus();
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
        startTimeRef.current = Date.now();
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
    setResponseTime(0);
    totalTargetsRef.current = 0;
    gameLoops.current = 0;
    TARGETS.current = [];
    playingRef.current = true;
    if (isSoundOn) {
      gunReloadRef.current.pause();
      gunReloadRef.current.currentTime = 0;
      gunReloadRef.current.play();
    }
  }

  function finishGame() {
    clearCanvas(ctx, canvasRef);
    setPlaying(false);
    playingRef.current = false;
  }

  function addTarget(targets) {
    if (canvasRef && canvasRef.current) {
      let x = 20 + Math.random() * (canvasRef.current.clientWidth - 40);
      let y = 20 + Math.random() * (canvasRef.current.clientHeight - 40);

      if (isCenterPlacement) {
        x = 20 + (canvasRef.current.clientWidth - 40);
        y = 20 + (canvasRef.current.clientHeight - 40);
        x = x / 2;
        y = y / 2;
      }
      const target = new TargetFull(x, y, 20, targets, null, 0);
      totalTargetsRef.current = totalTargetsRef.current + 1;
    }
  }

  function die(targets) {
    for (let i = 0; i < targets.current.length; i++) {
      if (targets.current[i].canDie()) {
        targets.current.splice(i, 1);
      }
    }
  }

  function mainLoop(timestamp) {
    if (playingRef.current && startTimeRef.current + 30000 > Date.now()) {
      clearCanvas(ctx, canvasRef);
      die(TARGETS);

      if (TARGETS.current.length === 0) {
        if (isCenterPlacement && Math.random() > 0.995) {
          addTarget(TARGETS);
        } else if (!isCenterPlacement && Math.random() > 0.9) {
          addTarget(TARGETS);
        }
      }
      TARGETS.current.forEach((b, index) => {
        b.updateCreature(ctx);
      });
      requestAnimationFrame(mainLoop);
    } else {
      finishGame();
      clearCanvas(ctx, canvasRef);
    }
  }

  function handleCanvasClick(e) {
    const mouse = new Vector(e.clientX - 40, e.clientY - 70);
    const targets = TARGETS.current;
    if (isSoundOn) {
      gunshotRef.current.pause();
      gunshotRef.current.currentTime = 0;
      gunshotRef.current.play();
    }
    
    for (let i = 0; i < targets.length; i++) {
      if (
        targets[i].pos.subtr(mouse).mag() < targets[i].orignalR &&
        targets[i].isActive
      ) {
        let localResponseTime = Date.now() - targets[i].birth;
        console.log(
          "before : ",
          localResponseTime,
          "targets : ",
          totalTargetsRef.current
        );
        const prevResponseTime = responseTime * (totalTargetsRef.current - 1);
        console.log(prevResponseTime);
        localResponseTime = localResponseTime + prevResponseTime;
        localResponseTime = localResponseTime / totalTargetsRef.current;
        console.log(localResponseTime);
        localResponseTime = Math.round(localResponseTime);
        setResponseTime(localResponseTime);
        targets[i].isClicked = true;
        targets[i].clickedTime = Date.now();
        targets[i].setClickedRadius();
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
      {isSoundOn ? (
        <div>
          <audio ref={gunshotRef} src={gunshot} />
          <audio ref={gunReloadRef} src={gunReload} />
        </div>
      ) : null}
      <ResponseTimeSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        isCenterPlacement={isCenterPlacement}
        setIsCenterPlacement={setIsCenterPlacement}
      />
      <ResponseTimeNavBar
        height={50}
        width={window.innerWidth}
        responseTime={responseTime}
        setIsSettingsOpen={setIsSettingsOpen}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
      />
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
          <Play
            width={window.innerWidth - 80}
            height={window.innerHeight - 90}
            startGame={startGame}
          />
        ) : !playing ? (
          <ResponseTimeResults
            width={window.innerWidth - 80}
            height={window.innerHeight - 90}
            startGame={startGame}
            responseTime={responseTime}
          />
        ) : null}

        {isCountDown ? (
          <CountDownTimer
            width={window.innerWidth - 80}
            height={window.innerHeight - 90}
          />
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
          // style={{ backgroundColor: "rgb(6, 43, 66)" }}
        ></canvas>
      </div>
    </div>
  );
};

export default ResponseArena;
