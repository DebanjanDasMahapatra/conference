import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Welcome from './components/Welcome/Welcome.js';
import { createMuiTheme, MuiThemeProvider, useMediaQuery } from '@material-ui/core';

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
      <Route path="/" render={(props) => <Welcome {...props} />} />
    </Router>
  </MuiThemeProvider>

}

export default App;
