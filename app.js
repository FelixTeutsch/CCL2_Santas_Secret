const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const ejs = require('ejs');

// Port
const port = 3000;

// Create an Express app
const app = express();
app.use(cors());

// Set views directory and view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse request bodies as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse cookies with cookie-parser
app.use(cookieParser());
app.use(fileUpload());

// Define your routes here
const indexRoute = require('./routes/index');
const apiRoute = require('./routes/api');
const groupRouter = require('./routes/group');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');
const publicRouter = require('./routes/public');

app.use('/', indexRoute); // Also handels register, login, logout!
app.use('/api', apiRoute);
app.use('/group', groupRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);
app.use('/public', publicRouter);

// Start the app and listen for requests on specified port
app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
