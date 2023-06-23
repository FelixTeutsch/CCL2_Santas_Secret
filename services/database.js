// Load environment variables from .env file
require('dotenv').config();
const mySQL = require('mysql');

// Local DB configuration
const config = mySQL.createConnection({
	host: 'localhost',
	port: '',
	user: 'root',
	password: '',
	database: 'santas_secret2',
	multipleStatements: true,
});

/**
 * Handle the database connection and reconnect if disconnected.
 */
function handleDisconnect() {
	config.connect((err) => {
		if (err) {
			console.error('Error connecting to database:', err);
			setTimeout(handleDisconnect, 5000); // Wait for 5 seconds before trying to reconnect
		} else {
			console.log('Connected to database!');
		}
	});

	config.on('error', (err) => {
		console.error('Database connection error:', err);
		setTimeout(handleDisconnect, 5000); // Retry connection after 5 seconds
	});
}

// Initial connection attempt
handleDisconnect();

module.exports = { config };
