import { useEffect, useRef, useState } from "react";
import { Vector } from "../../classes/vector";
import "./gravity.css";
import CountDownTimer from "../../components/common/countDownTimer";
import Play from "../../components/common/play";
import gunshot from "../../assets/sounds/shotgun.mp3";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { TargetGravity } from "../../classes/targetGravity";
import GravitySettings from "../../components/gravity/gravitySettings";
import GravityNavBar from "../../components/gravity/gravityNavbar";
import GravityResults from "../../components/gravity/gravityResults";

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

const GravityArena = () => {
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [totalLifes, setTotalLifes] = useState(5);
  const [lifes, setlifes] = useState(totalLifes);
  const lifesRef = useRef(totalLifes);
  const gameLoops = useRef(0);
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
  const [isGravityReversed, setIsGravityReversed] = useState(false);

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
      const y = isGravityReversed ? -20 : canvasRef.current.clientHeight + 20;
      const target = new TargetGravity(
        x,
        y,
        20,
        targets,
        data,
        isGravityReversed,
        4
      );
      data.current.totalTargets = data.current.totalTargets + 1;
    }
  }

  function die(targets) {
    for (let i = 0; i < targets.current.length; i++) {
      if (targets.current[i].canDie(canvasRef.current.clientHeight)) {
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
    const mouse = new Vector(e.clientX - 40, e.clientY - 70);
    if (isSoundOn) {
      gunshotRef.current.pause();
      gunshotRef.current.currentTime = 0;
      gunshotRef.current.play();
    }
    const targets = TARGETS.current;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].pos.subtr(mouse).mag() < targets[i].r) {
        setHits(hits + 1);
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
      {isSoundOn ? (
        <div>
          <audio ref={gunshotRef} src={gunshot} />
          <audio ref={gunReloadRef} src={gunReload} />
        </div>
      ) : null}
      <GravitySettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        spawnRateLimit={spawnRateLimit}
        spawnRateIncrease={spawnRateIncrease}
        setSpawnRateLimit={setSpawnRateLimit}
        setSpawnRateIncrease={setSpawnRateIncrease}
        totalLifes={totalLifes}
        setTotalLifes={setTotalLifes}
        isGravityReversed={isGravityReversed}
        setIsGravityReversed={setIsGravityReversed}
      />

      <GravityNavBar
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
          <GravityResults
            width={window.innerWidth - 80}
            height={window.innerHeight - 90}
            data={data.current}
            startGame={startGame}
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

export default GravityArena;
