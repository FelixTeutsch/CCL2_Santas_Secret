const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const { verifyToken } = require('./services/authentication'); // Import the authentication file

// Port
const port = 8080;

// Create an Express app
const app = express();
app.use(cors());

// Set views directory and view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse request bodies as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse cookies with cookie-parser
app.use(cookieParser());
app.use(fileUpload());

// SERVE PUBLIC FILES:
// Serve static files from the "public" directory
app.use('/public', express.static('public', { fallthrough: true }));

// JWT verification middleware
app.use(verifyToken);

// Define your routes here
const indexRoute = require('./routes/index');
const apiRoute = require('./routes/api');
const homeRouter = require('./routes/home');
const gameRouter = require('./routes/game');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');

app.use('/', indexRoute); // Also handles register, login, logout!
app.use('/api', apiRoute);
// Maybe a new home router?
app.use((req, res, next) => {
	const resourcePath = req.url;

	if (!req.isAuthenticated && !resourcePath.startsWith('/public')) {
		res.redirect('/');
	} else {
		next();
	}
});
app.use('/home', homeRouter);
app.use('/game', gameRouter);
app.use('/search', searchRouter);
app.use('/profile', profileRouter);

// Custom error-handling middleware for handling static file not found, api error, and general page errors. Use next(); to make it cleaner
app.use((req, res, next) => {
	// Your existing error-handling logic
	const resourcePath = req.url;
	console.log('Unknown file Requested:', resourcePath);
	const publicPath = path.join(__dirname, 'public', resourcePath);
	const defaultImagePath = path.join(__dirname, 'public', 'images', 'default.jpg');

	// Serve default Image
	if (resourcePath.startsWith('/public') && !fs.existsSync(publicPath)) {
		if (resourcePath.startsWith('/public/images/') && !fs.existsSync(publicPath)) {
			res.sendFile(defaultImagePath);
			return;
		}
		const error = 'file not found';
		const message = 'Please use one of the following resources';
		const routes = ['/public/images', '/public/javascripts', '/public/stylesheets'];
		res.status(400).json({ error, message, routes });
	} else if (resourcePath.startsWith('/api')) res.status(500).json({ error: 'Error with the resource you requested' });
	else res.render('error');

	if (req.isAuthenticated) {
		console.log('User is authenticated');
		console.log('User data:', req.user);
	} else {
		console.log('User is not authenticated');
	}
	next();
});

// Start the app and listen for requests on the specified port
app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
