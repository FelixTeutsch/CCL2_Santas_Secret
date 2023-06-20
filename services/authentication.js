const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // not working, for whatever reason
const ACCESS_TOKEN_SECRET = 'test'; // token temporarily set to 'test' for testing purposes
const salt = 10;

async function authenticateUser({ username, password }, user, res, next) {
	if (user.username === username && (await checkPassword(password, user.password))) {
		const expirationTime = 60 * 60 * 24 * 7;
		const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
		const santas_cookies = await createJWT(user.U_ID, user.username);

		res.cookie('santas_cookies', santas_cookies, { maxAge: expirationDate });
		return true;
	} else {
		console.log('Wrong password!');
		return false;
	}
}

async function authenticateJWT(req, res, next) {
	const token = req.cookies['santas_cookies'];

	if (token) {
		jwt.verify(token, await ACCESS_TOKEN_SECRET, (error, decodedToken) => {
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

async function createJWT(id, username) {
	const expirationTime = 60 * 60 * 24 * 7;
	const expirationDate = Math.floor(Date.now() / 1000) + expirationTime; // 1 week from now
	return (santas_cookies = await jwt.sign({ id: id, username: username, exp: expirationDate }, ACCESS_TOKEN_SECRET));
}

function getJwtPayload(req, res, next) {
	const token = req.cookies['santas_cookies'];
	if (token) {
		const payload = jwt.decode(token);
		return payload;
	}
	return token;
}

function getJwtUsername(req, res, next) {
	const payload = getJwtPayload(req, res, next);
	if (payload) {
		const jwtUsername = payload.username;
		return jwtUsername;
	}
	return 'guest';
}

async function checkPassword(password, hash) {
	if (password && hash) {
		let pw = await bcrypt.compare(password, hash);
		return pw;
	} else return password === hash;
}

async function hashPassword(password) {
	return await bcrypt.hash(password, salt);
}

const verifyToken = (req, res, next) => {
	const token = req.cookies.santas_cookies;

	if (token) {
		jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				req.isAuthenticated = false;
				req.user = null;
			} else {
				req.isAuthenticated = true;
				req.user = {
					id: decoded.id,
					username: decoded.username,
				}; // Decoded user data from the JWT payload
			}
		});
	} else {
		req.isAuthenticated = false;
		req.user = null;
	}

	next();
};

module.exports = {
	authenticateUser,
	authenticateJWT,
	createJWT,
	getJwtPayload,
	getJwtUsername,
	hashPassword,
	verifyToken,
};
