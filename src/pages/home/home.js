import { Link } from "react-router-dom";
import aimLogo from "../../assets/aim.png";
import "./home.css";

import { GithubFilled } from "@ant-design/icons";
const Home = (props) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
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
          <Link to={"/aim-trainer/challenge"} className="link mr-5">
            Challenge mode
          </Link>
          <Link to={"/aim-trainer/response"} className="link mr-5">
            Response time mode
          </Link>
          <Link to={"/aim-trainer/precision"} className="link mr-5">
            Precision mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
