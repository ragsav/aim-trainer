import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ChallengeArena from "./pages/challenge/challenge";
import "antd/dist/antd.css";
import Home from "./pages/home/home";
import ResponseArena from "./pages/responseTime/responseTime";
import PrecisionArena from "./pages/precision/precision";
function App() {
  return (
    <div className="App">
      {/* <Home /> */}
      {/* <ChallengeArena /> */}
      {/* <ResponseArena /> */}
      <Router>
        <Switch>
          <Route exact path="/aim-trainer">
            <Home />
          </Route>
          <Route exact path="/aim-trainer/challenge">
            <ChallengeArena />
          </Route>
          <Route exact path="/aim-trainer/response">
            <ResponseArena />
          </Route>
          <Route exact path="/aim-trainer/precision">
            <PrecisionArena/>
          </Route>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
