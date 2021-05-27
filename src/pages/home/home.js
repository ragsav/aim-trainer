import { Link } from "react-router-dom";
import aimLogo from "../../assets/aim.png";
import "./home.css";
import gunReload from "../../assets/sounds/shotgun-reload.mp3";
import { GithubFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import revolver from "../../assets/revolver.png";


const ModesLink = (props) => {
  const [isLinkHover, setIsLinkHover] = useState(false);
  return (
    <div
      className="w-100 d-flex flex-column align-items-start px-3 mt-4"
      style={{ textAlign: "start" ,borderLeft:"4px solid tomato",borderRadius:5}}

    >
      
      <div
        className="d-flex justify-content-start align-items-center w-100"
        onMouseEnter={() => {
          setIsLinkHover(true);
        }}
        onMouseLeave={() => {
          setIsLinkHover(false);
        }}
      >
        {isLinkHover ? (
          <img src={revolver} style={{ height: 36, width: 36 }} className="mr-3"></img>
        ) : null}
        <Link to={`/aim-trainer/${props.url}`} className="link">
          {props.title}
        </Link>
        {/* <div style={{backgroundColor:"tomato",height:2 ,width:"100%"}}></div> */}
      </div>

      <p className="mode-description" style={{ fontSize: "medium" }}>
        {props.desrciption}
      </p>
    </div>
  );
};



const Home = (props) => {
  const gunReloadRef = useRef(null);
  const [isLogoHover, setIsLogoHover] = useState(false);
  

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
              url="challenge"
              title="CHALLENGE"
              desrciption="In this mode you can practice everything including response time,
              precision, accuracy, speed, with and without moving targets"
              
            />
            <ModesLink
              key={2}
              url="gravity"
              title="GRAVITY"
              desrciption="In this mode you can practice your aim with targets 
              being thrown up with the effect of gravity on them,
              and improve everything including response time,
              precision, accuracy, speed, with option to reverse the gravity also"
              
            />
            <ModesLink
              key={3}
              url="precision"
              title="PRECISION"
              desrciption="In this mode you can practice your precision, 
              which can help you improve your headshots in the game. In this mode the targets are smaller in size."
              
            />
            <ModesLink
              key={4}
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
