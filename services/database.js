// Define The Database Servicerequire('dotenv').config();
const mySQL = require('mysql');

// const config = mySQL.createConnection({
//     host: 'atp.fhstp.ac.at',
//     port: '8007',
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// Local DB
const config = mySQL.createConnection({
	host: 'localhost',
	port: '',
	user: 'root',
	password: '',
	database: 'santas_secret',
});

config.connect(function (err) {
	if (err) throw err;
	console.log('Connected');
});

module.exports = { config };
