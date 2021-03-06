import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useRouteMatch
} from "react-router-dom";
import Welcome from './components/Welcome/Welcome.js';
import Meeting from './components/MeetingArena/Meeting.js';

const MyLink = ({ label, to, activeOnlyWhenExact }) => {
  let match = useRouteMatch({
    path: to,
    strict: true,
    sensitive: true
  });

  return (
    <Link to={to}>
      {" "}{label}{" "}
    </Link>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={Welcome}></Route>
{/*         
        <Route path="/join" component={Meeting}></Route> */}
        </Router>
    </div>
  );
}

export default App;
