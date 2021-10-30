import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Welcome from './components/Welcome/Welcome.js';
import { AppBar, Button, createTheme, MuiThemeProvider, Toolbar, Typography, useMediaQuery } from '@material-ui/core';
import InitializeMeeting from './components/InitializeMeeting/InitializeMeeting.js';
import SignIn from './components/Authentication/SignIn.js';
import { CONFIGS } from './config.js';

const App = () => {

	console.clear();
	const [isSignedIn, setSignedIn] = React.useState(CONFIGS.isSignedIn());
	const [updating, setUpdating] = React.useState(false);
	const [shouldDisplayAppbar, setDisplayAppBar] = React.useState(true);
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const theme = React.useMemo(() =>
		createTheme({
			components: {
				MuiAppBar: {
					defaultProps: {
						enableColorOnDark: true,
					},
				},
			},
			palette: {
				type: prefersDarkMode ? 'dark' : 'light',
			},
		}),
		[prefersDarkMode],
	);

	const signOut = () => {
		CONFIGS.signOut();
		setUpdating(true);
	}

	React.useEffect(() => {
		if (updating) {
			setSignedIn(CONFIGS.isSignedIn());
			setUpdating(false);
		}
	}, [updating]);

	return <MuiThemeProvider theme={theme}>
		{shouldDisplayAppbar && <AppBar position="fixed" color="default">
			<Toolbar variant="dense">
				<Typography variant="h6" color="inherit" component="div" noWrap className="df"> Quick Meet </Typography>
				{isSignedIn && <Button variant="outlined" onClick={signOut}>Sign Out</Button>}
			</Toolbar>
		</AppBar>}
		<Router>
			<Switch>
				<Route exact path="/" render={(props) => <Welcome {...props} />} />
				<Route exact path="/signin" render={(props) => <SignIn {...props} setUpdating={setUpdating} />} />
				<Route exact path="/join/:meetingId" render={(propas) => <InitializeMeeting {...propas} setDisplayAppBar={setDisplayAppBar} />} />
			</Switch>
		</Router>
	</MuiThemeProvider>

}

export default App;
