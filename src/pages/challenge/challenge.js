import { useEffect, useRef, useState } from "react";
import { TargetFull } from "../../classes/targetFull";
import { Vector } from "../../classes/vector";
import CountDownTimer from "../../components/common/countDownTimer";
import Play from "../../components/common/play";
import ChallengeNavBar from "../../components/challenge/challengeNavbar";
import ChallengeResults from "../../components/challenge/challengeResults";
import ChallengeSettings from "../../components/challenge/challengeSettings";
import Modal from "antd/lib/modal/Modal";
import gunshot from "../../assets/sounds/shotgun.mp3";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { useStorageActions } from "../../context/storageContext";




const paddingX = window.innerWidth<750?10:20;

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

const ChallengeArena = () => {
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [totalLifes, setTotalLifes] = useState(5);
  const [lifes, setlifes] = useState(totalLifes);
  const lifesRef = useRef(totalLifes);
  const gameLoops = useRef(0);
  const [speed, setSpeed] = useState(0);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(playingRef.current);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const TARGETS = useRef([]);
  const data = useRef({ totalTargets: 0, targets: [], finishTime: null });
  const [hits, setHits] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [spawnRateLimit, setSpawnRateLimit] = useState(1000);
  const [spawnRateIncrease, setSpawnRateIncrease] = useState(50);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const gunshotRef = useRef(null);
  const gunReloadRef = useRef(null);
  const { addChallengeScore } = useStorageActions();

  useEffect(() => {
    if (isSettingsOpen && playing) {
      finishGame();
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    setlifes(totalLifes);
  }, [totalLifes]);

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
    setlifes(totalLifes);
    setHits(0);
    gameLoops.current = 0;
    startTimeRef.current = Date.now();
    lifesRef.current = totalLifes;
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
    data.current.finishTime = Date.now();
    setPlaying(false);
    playingRef.current = false;
    if (gameStarted) {
      addChallengeScore(data.current);
    }
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
      const target = new TargetFull(x, y, 20, targets, data, speed);
      data.current.totalTargets = data.current.totalTargets + 1;
    }
  }

  function die(targets) {
    for (let i = 0; i < targets.current.length; i++) {
      if (targets.current[i].canDie()) {
        if (!targets.current[i].isClicked) {
          decreaseLife();
          if (lifesRef.current === 0) {
            finishGame();
            clearCanvas(ctx, canvasRef);
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
      let spawnBuffer = spawnRateLimit;
      if (gameLoops.current * spawnRateIncrease < 2000 - spawnBuffer) {
        spawnBuffer = 2000 - gameLoops.current * spawnRateIncrease;
      }
      if (Date.now() > startTimeRef.current + spawnBuffer) {
        addTarget(TARGETS);
        startTimeRef.current = Date.now();
        gameLoops.current = gameLoops.current + 1;
      }
      TARGETS.current.forEach((b, index) => {
        b.updateCreature(ctx);
      });
      requestAnimationFrame(mainLoop);
    } else {
      clearCanvas(ctx, canvasRef);
    }
  }

  function handleCanvasClick(e) {
    e.preventDefault();
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
        setHits(hits + 1);
        targets[i].isClicked = true;
        targets[i].clickedTime = Date.now();
        targets[i].setClickedRadius();
        targets[i].clickPos = mouse;
      }
    }
  }

  function handleKeyDown(e) {
    e.preventDefault();
    if (e.keyCode === 32 || e.keyCode === 27) {
      console.log("space key pressed");
      finishGame();
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{ height: "100%", width: "100%" }}
      className="d-flex flex-column"
    >
      {isSoundOn ? (
        <div>
          <audio ref={gunshotRef} src={gunshot} />
          <audio ref={gunReloadRef} src={gunReload} />
        </div>
      ) : null}
      <ChallengeSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        spawnRateLimit={spawnRateLimit}
        spawnRateIncrease={spawnRateIncrease}
        setSpawnRateLimit={setSpawnRateLimit}
        setSpawnRateIncrease={setSpawnRateIncrease}
        totalLifes={totalLifes}
        setTotalLifes={setTotalLifes}
        speed={speed}
        setSpeed={setSpeed}
      />

      <ChallengeNavBar
        lifes={lifes}
        hits={hits}
        height={50}
        width={window.innerWidth}
        setIsSettingsOpen={setIsSettingsOpen}
        totalLifes={totalLifes}
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
            width={window.innerWidth - 4 * paddingX}
            height={window.innerHeight - 90}
            startGame={startGame}
          />
        ) : !playing ? (
          <ChallengeResults
            width={window.innerWidth - 4 * paddingX}
            height={window.innerHeight - 90}
            data={data.current}
            startGame={startGame}
          />
        ) : null}

        {isCountDown ? (
          <CountDownTimer
            width={window.innerWidth - 4 * paddingX}
            height={window.innerHeight - 90}
          />
        ) : null}
        <canvas
          style={{ position: "absolute" }}
          className="canvas"
          onClick={handleCanvasClick}
          tabIndex={1}
          id="canvas"
          // contentEditable={true}
          ref={canvasRef}
          width={window.innerWidth - 4 * paddingX}
          height={window.innerHeight - 90}
          // style={{ backgroundColor: "rgb(6, 43, 66)" }}
        ></canvas>
      </div>
    </div>
  );
};

export default ChallengeArena;
