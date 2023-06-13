const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// Port
const port = 42069;

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

// Define your routes here
const indexRoute = require('./routes/index');
const apiRoute = require('./routes/api');
const groupRouter = require('./routes/group');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');

app.use('/', indexRoute); // Also handles register, login, logout!
app.use('/api', apiRoute);
app.use('/group', groupRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);

// SERVE PUBLIC FILES:
// Serve static files from the "public" directory
app.use('/public', express.static('public', { fallthrough: true }));
// Custom error-handling middleware for handling static file not found
app.use((req, res, next) => {
	const resourcePath = req.url;
	console.log('Unknown file Requested:', resourcePath);
	const publicPath = path.join(__dirname, 'public', resourcePath);
	const defaultImagePath = path.join(__dirname, 'public', 'images', 'default.jpg');

	// Serve default Image
	if (resourcePath.startsWith('/public/images/') && !fs.existsSync(publicPath)) {
		res.sendFile(defaultImagePath);
	} else {
		const error = 'file not found';
		const message = 'Please use one of the following resources';
		const routes = ['/public/images', '/public/javascripts', '/public/stylesheets'];
		res.status(400).json({ error, message, routes });
	}
});

// Start the app and listen for requests on the specified port
app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
