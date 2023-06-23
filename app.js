// Import required modules
const express = require('express'); // Express web framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const fileUpload = require('express-fileupload'); // Middleware for handling file uploads
const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const cors = require('cors'); // Middleware for enabling CORS
const path = require('path'); // Node.js path module for working with file paths
const ejs = require('ejs'); // Template engine for rendering views
const fs = require('fs'); // Node.js file system module
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

// Enable file uploads and create parent directories if necessary
app.use(fileUpload({ createParentPath: true }));

// SERVE PUBLIC FILES:
// Serve static files from the "public" directory
app.use('/public', express.static('public', { fallthrough: true }));

// JWT verification middleware
app.use(verifyToken);

// Define your routes here

/**
 * Index route.
 * Handles register, login, and logout functionality.
 */
const indexRoute = require('./routes/index');
app.use('/', indexRoute);

/**
 * API route.
 * Handles API requests.
 */
const apiRoute = require('./routes/api');
app.use('/api', apiRoute);

// Maybe a new home router?
const homeRouter = require('./routes/home');
app.use('/home', homeRouter);

/**
 * Game router.
 * Handles game-related routes.
 */
const gameRouter = require('./routes/game');
app.use('/game', gameRouter);

/**
 * Profile router.
 * Handles user profile-related routes.
 */
const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

/**
 * Search router.
 * Handles search-related routes.
 */
const searchRouter = require('./routes/search');
app.use('/search', searchRouter);

// Custom error-handling middleware for handling static file not found, API errors, and general page errors. Use next(); to make it cleaner
app.use((req, res, next) => {
	// Your existing error-handling logic
	const resourcePath = req.url;
	console.log('Unknown file Requested:', resourcePath);
	const publicPath = path.join(__dirname, 'public', resourcePath);
	const defaultImagePath = path.join(__dirname, 'public', 'images', 'default.jpg');

	// Serve default image
	if (resourcePath.startsWith('/public') && !fs.existsSync(publicPath)) {
		if (resourcePath.startsWith('/public/images/') && !fs.existsSync(publicPath)) {
			res.sendFile(defaultImagePath);
			return;
		}
		const error = 'file not found';
		const message = 'Please use one of the following resources';
		const routes = ['/public/images', '/public/javascripts', '/public/stylesheets'];
		res.status(404).render('error', { status: 404, error, message, routes });
	} else if (resourcePath.startsWith('/api')) {
		res.status(500).json({ error: 'Error with the resource you requested' });
	} else {
		res.render('error');
	}

	// Log user authentication status and data
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
