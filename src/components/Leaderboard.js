import React from "react";
import { BrowserRouter as Router, Route, Switch,  NavLink ,Redirect} from "react-router-dom";
import OptimismLeaderboard from "./Optimisim"
import BaseLeaderboard from "./Base";
import  "./leaderboard.css";
const Leaderboard = () => {
  return (
    <Router>
       <div className="leaderboard-containerss">
        <div className="table-container">
        <h1 className="leaderboard-heading">Leaderboard</h1>
        <p className="leaderboard-subtitle">See where you fit against the best</p>

        <div className="routes">
  <NavLink
    to="/leaderboard/base"
    activeClassName="active-link"
    className="nav-link"
  >
    BASE
  </NavLink>
  <NavLink
    to="/leaderboard/optimism"
    activeClassName="active-link"
    className="nav-link"
  >
    OPTIMISM
  </NavLink>
</div>

        <Switch>
          <Route path="/leaderboard/base" component={BaseLeaderboard} />
          <Route path="/leaderboard/optimism" component={OptimismLeaderboard} />
          <Redirect from="/" to="/leaderboard/optimism" />
        </Switch>
      </div>
      </div>
    </Router>
  );
};

export default Leaderboard;
