import { Link } from "react-router-dom";
import aimLogo from "../../assets/aim.png";
import "./home.css";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { GithubFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import revolver from "../../assets/revolver.png";
const Home = (props) => {
  const gunReloadRef = useRef(null);
  const [isLogoHover, setIsLogoHover] = useState(false);
  const [isLinkHover, setIsLinkHover] = useState(-1);

  useEffect(() => {
    if (isLogoHover && gunReloadRef && gunReloadRef.current) {
      console.log("hello");
      gunReloadRef.current.pause();
      gunReloadRef.current.currentTime = 0;
      gunReloadRef.current.play();
    }
  }, [isLogoHover]);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <audio ref={gunReloadRef} src={gunReload} />
      <div className="d-flex justify-content-between align-items-center w-100 container">
        <div
          className="d-flex justify-content-start align-items-center w-100 mt-3"
          style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
        >
          <img
            src={aimLogo}
            height={60}
            width={60}
            className="mr-3 logo"
            onMouseEnter={() => {
              setIsLogoHover(true);
            }}
            onMouseLeave={() => {
              setIsLogoHover(false);
            }}
          />
          <span className="nav-bar-title">Aim Trainer</span>
        </div>
        <div
          className="d-flex justify-content-end align-items-center w-100 mt-3"
          style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
        >
          <a href="https://github.com/ragsav/aim-trainer">
            <GithubFilled className="github" style={{ fontSize: 36 }} />
          </a>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-3 container h-100">
        <div
          className="w-100 d-flex flex-column justify-content-center align-items-start mt-5"
          style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
        >
          <div
            className="w-100 d-flex justify-content-start align-items-center mt-2"
            onMouseEnter={() => {
              setIsLinkHover(1);
            }}
            onMouseLeave={() => {
              setIsLinkHover(-1);
            }}
          >
            {isLinkHover       ===       1 ? (
              <img src={revolver} style={{ height: 36, width: 36 }}></img>
            ) : null}
            <Link to={"/aim-trainer/challenge"} className="link ml-3">
              Challenge mode
            </Link>
          </div>
          <div
            className="w-100 d-flex justify-content-start align-items-center mt-2"
            onMouseEnter={() => {
              setIsLinkHover(2);
            }}
            onMouseLeave={() => {
              setIsLinkHover(-1);
            }}
          >
            {isLinkHover       ===       2 ? (
              <img src={revolver} style={{ height: 36, width: 36 }}></img>
            ) : null}
            <Link to={"/aim-trainer/gravity"} className="link ml-3">
              Gravity mode
            </Link>
          </div>
          <div
            className="w-100 d-flex justify-content-start align-items-center mt-2"
            onMouseEnter={() => {
              setIsLinkHover(3);
            }}
            onMouseLeave={() => {
              setIsLinkHover(-1);
            }}
          >
            {isLinkHover       ===       3 ? (
              <img src={revolver} style={{ height: 36, width: 36 }}></img>
            ) : null}
            <Link to={"/aim-trainer/precision"} className="link ml-3">
              Precision mode
            </Link>
          </div>
          <div
            className="w-100 d-flex justify-content-start align-items-center mt-2"
            onMouseEnter={() => {
              setIsLinkHover(4);
            }}
            onMouseLeave={() => {
              setIsLinkHover(-1);
            }}
          >
            {isLinkHover       ===       4 ? (
              <img src={revolver} style={{ height: 36, width: 36 }}></img>
            ) : null}
            <Link to={"/aim-trainer/response"} className="link ml-3">
              Response mode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
