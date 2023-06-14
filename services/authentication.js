const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function authenticateUser({ username, password }, user, res) {
	console.log(username, password);

	if (user.username === username && (await checkPassword(password, user.password))) {
		console.log('User Logged in!');
		const expirationTime = 60 * 60 * 24 * 7;
		const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
		const accessToken = await createJWT(user.U_ID, expirationDate);

		res.cookie('accessToken', accessToken, { maxAge: expirationDate });
		res.redirect('/users/' + user.U_ID);
	} else {
		console.log('Wrong password!');
		res.status(401).send('Username or password incorrect');
	}
}

function authenticateJWT(req, res, next) {
	const token = req.cookies['accessToken'];
	// The variable ACCESS_TOKEN_SECRET is for whatever reason not working here...
	const secret = process.env.ACCESS_TOKEN_SECRET;

	if (token) {
		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				return res.sendStatus(403);
			}
			if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
				// Token has expired
				return res.sendStatus(401);
			} else {
				req.user = decodedToken;
				next();
			}
		});
	} else {
		res.sendStatus(401);
	}
}

async function createJWT(username, expirationTime) {
	// The variable ACCESS_TOKEN_SECRET is for whatever reason not working here...
	const secret = process.env.ACCESS_TOKEN_SECRET;
	// console.log("Creating access token for user:", username, "\nSecret:", secret);
	return (accessToken = await jwt.sign({ username: username, exp: expirationTime }, secret));
}

function getJwtPayload(req, res, next) {
	const token = req.cookies['accessToken'];
	if (token) {
		const payload = jwt.decode(token);
		// console.log('JWT payload is:', payload);
		return payload;
	}
	return token;
}

function getJwtUsername(req, res, next) {
	const payload = getJwtPayload(req, res, next);
	if (payload) {
		const jwtUsername = payload.username;
		// console.log("JWT Username is:", jwtUsername)
		return jwtUsername;
	}
	return 'guest';
}

async function checkPassword(password, hash) {
	let pw = await bcrypt.compare(password, hash);
	return pw;
}

module.exports = {
	authenticateUser,
	authenticateJWT,
	createJWT,
	getJwtPayload,
	getJwtUsername,
};
