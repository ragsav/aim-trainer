import { HeartFilled } from "@ant-design/icons";
const LifeIndicator = (props) => {
  const a = new Array(props.totalLifes).fill(1);
  return (
    <div
      style={{ color: "white", fontWeight: "600" }}
      className="d-flex justify-content-center align-items-end h-100"
    >
      {a.map((d, index) => {
        return (
          <div className="p-1">
            <HeartFilled
              style={{ color: index < props.value ? "red" : "white" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LifeIndicator;
