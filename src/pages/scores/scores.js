import { Link } from "react-router-dom";
import aimLogo from "../../assets/aim.png";
import "./scores.scss";
import { GithubFilled } from "@ant-design/icons";

import { useThemeActions, useThemeState } from "../../context/themeContext";
import {
  useStorageActions,
  useStorageState,
} from "../../context/storageContext";
import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";

const ChallengeScoreItem = (props) => {
  return <div>{``}</div>;
};

const ConfirmModal = (props) => {
  return (
    <Modal
      centered
      width="min-content"
      title=""
      visible={props.isConfirmationVisible}
      onCancel={() => {
        props.setIsConfirmationVisible(false);
      }}
      footer={null}
      className="confirmation-modal"
    >
      <p>All the data will be deleted</p>
      <p>Still want to delete?</p>
      <div className="d-flex justify-content-end align-items-center mt-3">
        <Button
          className="mr-2 "
          onClick={(e) => {
            e.preventDefault();
            // props.deleteData();
            props.setIsConfirmationVisible(false);
          }}
        >
          OK
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            props.setIsConfirmationVisible(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

const Scores = (props) => {
  const {
    getChallengeScore,
    getGravityScore,
    getPrecisionScore,
    getResponseScore,
    deleteData,
  } = useStorageActions();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  console.log({ challenge: getChallengeScore() });
  console.log({ gravity: getGravityScore() });
  console.log({ precision: getPrecisionScore() });
  console.log({ response: getResponseScore() });

  const { setTheme } = useThemeActions();
  const { theme } = useThemeState();
  return (
    <div className="d-flex flex-column justify-content-between align-items-center scores bg-animate">
      <ConfirmModal
        deleteData={deleteData}
        isConfirmationVisible={isConfirmationVisible}
        setIsConfirmationVisible={setIsConfirmationVisible}
      />
      <div class="lines-v">
        <div class="line-v"></div>
        <div class="line-v hide"></div>
        <div class="line-v"></div>
        <div class="line-v hide"></div>
        <div class="line-v"></div>
        <div class="line-v hide"></div>
        <div class="line-v"></div>
        <div class="line-v hide"></div>
        <div class="line-v"></div>
      </div>
      <div class="lines-h">
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
        <div class="line-h"></div>
      </div>
      <div className="d-flex justify-content-between align-items-center w-100 container mt-3">
        <div
          className="d-flex justify-content-start align-items-center w-100 mt-3"
          style={{ fontSize: "x-large", fontWeight: "700" }}
        >
          <Link
            to="/aim-trainer/"
            className="d-flex justify-content-center align-items-center "
          >
            <img src={aimLogo} className="mr-3 logo" />
            <span className="nav-bar-title color-animate">AIM TRAINER</span>
          </Link>
        </div>
        <div
          className="d-flex justify-content-end align-items-center w-100 mt-3"
          style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
        >
          <div
            to="/aim-trainer/scores"
            className="clear-scores h-100 d-flex align-items-end color-animate p-2"
            onClick={(e) => {
              e.preventDefault();
              setIsConfirmationVisible(true);
            }}
          >
            CLEAR SCORES
          </div>
          <img
            className={
              theme.localeCompare("dark") === 0
                ? "light-theme-logo mx-3"
                : "dark-theme-logo mx-3"
            }
            onClick={(e) => {
              e.preventDefault();
              e.target.classList.add("animate");

              setTimeout(() => e.target.classList.remove("animate"), 300);

              let flag = false;
              e.target.classList.forEach((val) => {
                if (val.localeCompare("light-theme-logo") === 0) {
                  setTheme("light");
                  flag = true;
                }
              });
              if (!flag) {
                setTheme("dark");
              }
              console.log(e);
            }}
          ></img>

          <a
            href="https://github.com/ragsav/aim-trainer"
            className="d-flex justify-content-center align-items-center"
          >
            <GithubFilled className="github" />
          </a>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-3 container mb-3"></div>
    </div>
  );
};

export default Scores;
