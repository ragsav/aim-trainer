import { Button } from "antd";
import aimLogo from "../../assets/aim.png";
import { SettingFilled, SoundFilled } from "@ant-design/icons";

import LifeIndicator from "../common/lifeIndicator";
const PrecisionNavBar = (props) => {
  return (
    <div
      style={{ height: props.height, width: props.width }}
      className="d-flex justify-content-between align-items-center px-5"
    >
      <div
        className="d-flex justify-content-left align-items-center "
        style={{ fontSize: "x-large", fontWeight: "700", color: "white" }}
      >
        <img
          src={aimLogo}
          height={30}
          width={30}
          className="mr-3 nav-bar-logo"
        />
        <span className="nav-bar-title">Precision</span>
      </div>
      <div
        className="d-flex justify-content-right align-items-center "
        style={{ fontSize: "large", fontWeight: "700", color: "white" }}
      >
        <span className="mr-3 nav-bar-stat-item">{`Precision : ${props.precision}`}</span>
        <Button
          className={
            props.isSoundOn
              ? "ml-5 settings-button"
              : "ml-5 sound-disabled-button"
          }
          icon={<SoundFilled style={{ fontSize: 20 }} />}
          onClick={() => props.setIsSoundOn(!props.isSoundOn)}
        />
        <Button
          className="ml-3 settings-button"
          icon={<SettingFilled style={{ fontSize: 20 }} />}
          onClick={() => props.setIsSettingsOpen(true)}
        />
      </div>
    </div>
  );
};

export default PrecisionNavBar;
