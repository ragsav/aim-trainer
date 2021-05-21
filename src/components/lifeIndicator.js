const LifeIndicator = (props) => {
  return (
    <div
      style={{ color: "white", fontWeight: "600" }}
    >{`Lifes remaining : ${props.value}`}</div>
  );
};

export default LifeIndicator;
