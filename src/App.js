import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Welcome from './components/Welcome/Welcome.js';
import { createMuiTheme, MuiThemeProvider, useMediaQuery } from '@material-ui/core';
import InitializeMeeting from './components/InitializeMeeting/InitializeMeeting.js';

const App = () => {

  console.clear();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );

  return <MuiThemeProvider theme={theme}>
    <Router>
      <Switch>
      <Route exact path="/" render={(props) => <Welcome {...props} />} />
      <Route exact path="/join/:meetingId" render={(propas) => <InitializeMeeting {...propas} />} />
      </Switch>
    </Router>
  </MuiThemeProvider>

}

export default App;
