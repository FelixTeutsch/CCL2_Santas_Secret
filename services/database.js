// Define The Database Servicerequire('dotenv').config();
const mySQL = require('mysql');
const dotenv = require('dotenv');
// const config = mySQL.createConnection({
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASS,
// 	database: process.env.DB_NAME,
// 	multipleStatements: true,
// });

// const config = mySQL.createConnection({
// 	host: '169.254.255.253',
// 	port: '3306',
// 	user: 'node-cc221036-10098',
// 	password: 'QN+-62h-yvF-JfQ',
// 	database: 'node_cc221036_10098',
// 	multipleStatements: true,
// });

// Local DB
const config = mySQL.createConnection({
	host: 'localhost',
	port: '',
	user: 'root',
	password: '',
	database: 'santas_secret',
	multipleStatements: true,
});

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
		setTimeout(handleDisconnect, 5000);
	});
}

// Initial connection attempt
handleDisconnect();
module.exports = { config };
