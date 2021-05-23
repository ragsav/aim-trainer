import { Slider, Switch } from "antd";
import Modal from "antd/lib/modal/Modal";
import { SettingFilled, CloseCircleFilled } from "@ant-design/icons";
const PrecisionSettings = (props) => {
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
          <span>Spawning target after </span>
          <Slider
            style={{ width: 200 }}
            defaultValue={props.speed}
            onChange={(value) => {
              props.setSpeed(value);
            }}
            tipFormatter={(value) => `${value} ms`}
            step={100}
            min={100}
            max={5000}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PrecisionSettings;
