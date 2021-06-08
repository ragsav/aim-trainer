import { useEffect, useRef, useState } from "react";
import { TargetFull } from "../../classes/targetFull";
import { Vector } from "../../classes/vector";
import CountDownTimer from "../../components/common/countDownTimer";
import Play from "../../components/common/play";
import PrecisionNavBar from "../../components/precision/precisionNabar";
import PrecisionResults from "../../components/precision/precisionResults";
import PrecisionSettings from "../../components/precision/precisionSettings";

import Modal from "antd/lib/modal/Modal";
import gunshot from "../../assets/sounds/shotgun.mp3";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { useStorageActions } from "../../context/storageContext";

const paddingX = window.innerWidth < 750 ? 10 : 20;

function clearCanvas(ctx, canvasRef) {
  ctx?.clearRect(
    0,
    0,
    canvasRef?.current?.clientWidth,
    canvasRef?.current?.clientHeight
  );
}

const boundaries = {
  left: paddingX,
  top: 120,
  right: window.innerWidth - paddingX,
  bottom: window.innerHeight - paddingX,
};

const PrecisionArena = () => {
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const lastTargetTime = useRef(Date.now());

  const gameLoops = useRef(0);

  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(playingRef.current);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const [isCenterPlacement, setIsCenterPlacement] = useState(false);
  const [precision, setPrecision] = useState(0);
  const precisionRef = useRef(0);
  const totalTargetsRef = useRef(0);
  const [speed, setSpeed] = useState(1000);
  const [hits, setHits] = useState(0);
  const hitsRef = useRef(0);
  const TARGETS = useRef([]);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const gunshotRef = useRef(null);
  const gunReloadRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { addPrecisionScore } = useStorageActions();
  

  useEffect(() => {
    if (isSettingsOpen && playing) {
      setPlaying(false);
      playingRef.current = false;
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
    setHits(0);
    hitsRef.current = 0;
    setPrecision(0);
    precisionRef.current = 0;
    totalTargetsRef.current = 0;
    lastTargetTime.current = Date.now();
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
    if (gameStarted) {
      addPrecisionScore({
        timestamp: Date.now(),
        precision: precisionRef.current,
        hits: hitsRef.current,
      });
    }
    setPlaying(false);
    playingRef.current = false;
  }

  function addTarget(targets) {
    if (canvasRef && canvasRef.current) {
      let x = 20 + Math.random() * (canvasRef.current.clientWidth - 40);
      let y = 20 + Math.random() * (canvasRef.current.clientHeight - 40);

      const target = new TargetFull(x, y, 7, targets, null, 0);
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

      if (lastTargetTime.current + speed < Date.now()) {
        addTarget(TARGETS);
        lastTargetTime.current = Date.now();
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
    const mouse = new Vector(e.clientX - 2 * paddingX, e.clientY - 70);
    if (isSoundOn) {
      gunshotRef.current.pause();
      gunshotRef.current.currentTime = 0;
      gunshotRef.current.play();
    }
    const targets = TARGETS.current;
    for (let i = 0; i < targets.length; i++) {
      if (
        targets[i].pos.subtr(mouse).mag() < targets[i].orignalR &&
        targets[i].isActive
      ) {
        let prevPrecision = precision * hits;
        let currentPrecision =
          ((targets[i].orignalR - mouse.subtr(targets[i].pos).mag()) * 100) /
          targets[i].orignalR;

        currentPrecision = (currentPrecision + prevPrecision) / (hits + 1);
        precisionRef.current = currentPrecision;
        setPrecision(currentPrecision);
        hitsRef.current = hits + 1;
        setHits(hits + 1);

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
      setPlaying(false);
      playingRef.current = false;
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
      <PrecisionSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        speed={speed}
        setSpeed={setSpeed}
      />
      <PrecisionNavBar
        height={50}
        width={window.innerWidth}
        precision={precision}
        setIsSettingsOpen={setIsSettingsOpen}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
      />
      <div
        style={{
          height: window.innerHeight - 50,
          width: window.innerWidth,
          padding: paddingX,
          position: "relative",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        {!gameStarted ? (
          <Play
            width={window.innerWidth - 4     *     paddingX}
            height={window.innerHeight - 90}
            startGame={startGame}
          />
        ) : !playing ? (
          <PrecisionResults
            width={window.innerWidth - 4     *     paddingX}
            height={window.innerHeight - 90}
            startGame={startGame}
            precision={precision}
            hits={hits}
          />
        ) : null}

        {isCountDown ? (
          <CountDownTimer
            width={window.innerWidth - 4     *     paddingX}
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
          width={window.innerWidth - 4     *     paddingX}
          height={window.innerHeight - 90}
          // style={{ backgroundColor: "rgb(6, 43, 66)" }}
        ></canvas>
      </div>
    </div>
  );
};

export default PrecisionArena;
