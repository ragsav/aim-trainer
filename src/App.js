import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ChallengeArena from "./components/challengeArena";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <ChallengeArena />
          </Route>
          <Route exact path="/challenge"></Route>
          <Route exact path="/precision"></Route>
          <Route exact path="/double"></Route>
          <Route exact path="/moving"></Route>
          <Route exact path="/tracking"></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
