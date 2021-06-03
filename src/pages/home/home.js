import { Link } from "react-router-dom";
import aimLogo from "../../assets/aim.png";
import "./home.scss";
import { Switch } from "antd";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { GithubFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import revolver from "../../assets/revolver.png";
import revolverLight from "../../assets/revolver_light.png";
import challenge from "../../assets/thumbnails/challenge.PNG";
import { useThemeActions,useThemeState } from "../../context/themeContext";

const ModesLink = (props) => {
  const [isLinkHover, setIsLinkHover] = useState(false);
  const {theme} = useThemeState();
  return (
    <div
      className="w-100 row m-0 p-0 px-1 mt-4 py-1 pb-2 mode-container"
      onMouseEnter={() => {
        setIsLinkHover(true);
      }}
      onMouseLeave={() => {
        setIsLinkHover(false);
      }}
      style={{
        
        animationDelay: props.delay,
        
      }}
    >
      <div
        className=" col-md-4 col-lg-3 m-0 p-0 px-2  mt-2  order-md-1 order-2"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Link to={`/aim-trainer/${props.url}`}>
          <img
            src={challenge}
            style={{
              width: "100%",
              height: "100%",
              border:theme.localeCompare('dark')===0?"2px solid tomato":"none",
              borderRadius: 4,
            }}
          ></img>
        </Link>
      </div>

      <div
        className=" col-md-8 col-lg-9 m-0 p-0 w-100 d-flex flex-column align-items-start px-3  order-md-2 order-1"
        style={{
          textAlign: "start",
          
        }}
      >
        <div className="d-flex justify-content-start align-items-center w-100">
          {isLinkHover ? (
            <img
              src={theme.localeCompare('dark')===0?revolver:revolverLight}
              style={{ height: 36, width: 36 }}
              className="mr-3"
            ></img>
          ) : null}
          <Link to={`/aim-trainer/${props.url}`} className="link">
            {props.title}
          </Link>
          
        </div>

        <p
          className="mode-description"
          style={{ fontSize: "medium", fontWeight: "600" }}
        >
          {props.desrciption}
        </p>
      </div>
    </div>
  );
};



const Home = (props) => {
  const gunReloadRef = useRef(null);
  const [isLogoHover, setIsLogoHover] = useState(false);
  const {setTheme} = useThemeActions();
const { theme } = useThemeState();
  useEffect(() => {
    if (isLogoHover && gunReloadRef && gunReloadRef.current) {
      console.log("hello");
      gunReloadRef.current.pause();
      gunReloadRef.current.currentTime = 0;
      gunReloadRef.current.play();
    }
  }, [isLogoHover]);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center home">
      <audio ref={gunReloadRef} src={gunReload} />
      <div className="d-flex justify-content-between align-items-center w-100 container mt-3">
        <div
          className="d-flex justify-content-start align-items-center w-100 mt-3"
          style={{ fontSize: "x-large", fontWeight: "700" }}
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
          <span
            className="toggle active mx-3"
            onClick={(e) => {
              e.preventDefault();
              e.target.classList.add("animate");

              setTimeout(() => {
                e.target.classList.toggle("active");
              }, 150);

              setTimeout(() => e.target.classList.remove("animate"), 300);
              
              let flag = false;
              e.target.classList.forEach((val) => {
                if (val.localeCompare("active") === 0) {
                  setTheme("light");
                  flag = true;
                }
              });
              if (!flag) {
                setTheme("dark");
              }
              console.log(e);
              
            }}
          ></span>
          

          <a
            href="https://github.com/ragsav/aim-trainer"
            className="d-flex justify-content-center align-items-center"
          >
            <GithubFilled className="github"  />
          </a>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-3 container mb-3">
        <div
          className="w-100 d-flex flex-column justify-content-center align-items-start mt-5"
          style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
        >
          <div
            className="w-100 d-flex flex-column align-items-start mt-2"
            style={{ textAlign: "start" }}
          >
            <ModesLink
              key={1}
              delay={"0s"}
              url="challenge"
              title="CHALLENGE"
              desrciption="In this mode you can practice everything including response time,
              precision, accuracy, speed, with and without moving targets"
            />

            <ModesLink
              key={2}
              delay={"0.1s"}
              url="gravity"
              title="GRAVITY"
              desrciption="In this mode you can practice your aim with targets 
              being thrown up with the effect of gravity on them,
              and improve everything including response time,
              precision, accuracy, speed, with option to reverse the gravity also"
            />
            <ModesLink
              key={3}
              delay={"0.2s"}
              url="precision"
              title="PRECISION"
              desrciption="In this mode you can practice your precision, 
              which can help you improve your headshots in the game. In this mode the targets are smaller in size."
            />
            <ModesLink
              key={4}
              delay={"0.3s"}
              url="response"
              title="RESPONSE"
              desrciption="In this mode you can practice and improve your response time."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
