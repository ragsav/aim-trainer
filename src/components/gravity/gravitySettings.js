import { Slider, Switch } from "antd";
import Modal from "antd/lib/modal/Modal";
import { SettingFilled, CloseCircleFilled } from "@ant-design/icons";
const GravitySettings = (props) => {
  return (
    <Modal
      centered
      visible={props.isSettingsOpen}
      width={500}
      title={
        <div className="d-flex justify-content-start align-items-center m-0">
          <SettingFilled />
          <span
            style={{
              backgroundColor: "#FFFFFF",
              color: "rgb(6, 43, 66)",
              fontSize: "large",
              fontWeight: "900",
            }}
            className="ml-2"
          >
            SETTINGS
          </span>
        </div>
      }
      onCancel={() => props.setIsSettingsOpen(false)}
      closeIcon={<CloseCircleFilled className="settings-close-button" />}
      footer={null}
    >
      <div
        className="d-flex flex-column justify-content-start align-items-center m-0"
        style={{
          backgroundColor: "#FFFFFF",
          color: "rgb(6, 43, 66)",
          fontSize: "large",
          fontWeight: "700",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mt-4 w-100 ">
          <span>Spawn rate increase/sec</span>
          <Slider
            style={{ width: 200 }}
            defaultValue={props.spawnRateIncrease}
            onChange={(value) => {
              props.setSpawnRateIncrease(value);
            }}
            step={10}
            min={0}
            max={400}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4 w-100 ">
          <span>Spawn rate limit</span>
          <Slider
            style={{ width: 200 }}
            defaultValue={props.spawnRateLimit}
            onChange={(value) => {
              props.setSpawnRateLimit(value);
            }}
            step={100}
            min={100}
            max={2000}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4 w-100 ">
          <span>Lifes</span>
          <Slider
            style={{ width: 200 }}
            defaultValue={props.totalLifes}
            onChange={(value) => {
              props.setTotalLifes(value);
            }}
            step={1}
            min={1}
            max={8}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4 w-100 ">
          <span>Reverse gravity</span>
          <Switch
            defaultValue={props.isGravityReversed}
            onChange={(b) => {
              props.setIsGravityReversed(b);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GravitySettings;
