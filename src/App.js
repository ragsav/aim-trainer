import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ChallengeArena from "./components/challengeArena";
import "antd/dist/antd.css";
function App() {
  return (
    <div className="App">
      <ChallengeArena />
      {/* <Router>
        <Switch>
          <Route exact path="/">
            <ChallengeArena />
          </Route>
          <Route exact path="/challenge">
            <ChallengeArena />
          </Route>
          <Route exact path="/precision"></Route>
          <Route exact path="/double"></Route>
          <Route exact path="/moving"></Route>
          <Route exact path="/tracking"></Route>
          <Route>C</Route>
        </Switch>
      </Router> */}
    </div>
  );
}

export default App;
