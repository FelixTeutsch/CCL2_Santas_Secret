const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = 'test'; // token temporarily set to 'test' for testing purposes
const salt = 10;

/**
 * Authenticate a user with username and password.
 *
 * @param {Object} credentials - The user's credentials containing username and password.
 * @param {Object} user - The user object to compare credentials against.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
async function authenticateUser(credentials, user, res, next) {
	if (user.username === credentials.username && (await checkPassword(credentials.password, user.password))) {
		const expirationTime = 60 * 60 * 24 * 7; // 1 week
		const expirationDate = Math.floor(Date.now() / 1000) + expirationTime;
		const santas_cookies = await createJWT(user.U_ID, user.username);

		res.cookie('santas_cookies', santas_cookies, { maxAge: expirationDate });
		return true;
	} else {
		console.log('Wrong password!');
		return false;
	}
}

/**
 * Authenticate a JWT token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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

/**
 * Create a JWT token.
 *
 * @param {string} id - The user ID.
 * @param {string} username - The username.
 * @returns {string} The JWT token.
 */
async function createJWT(id, username) {
	const expirationTime = 60 * 60 * 24 * 7; // 1 week
	const expirationDate = Math.floor(Date.now() / 1000) + expirationTime;
	return (santas_cookies = await jwt.sign({ id: id, username: username, exp: expirationDate }, ACCESS_TOKEN_SECRET));
}

/**
 * Get the payload of a JWT token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Object} The payload of the JWT token.
 */
function getJwtPayload(req, res, next) {
	const token = req.cookies['santas_cookies'];
	if (token) {
		const payload = jwt.decode(token);
		return payload;
	}
	return token;
}

/**
 * Get the username from a JWT token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {string} The username from the JWT token.
 */
function getJwtUsername(req, res, next) {
	const payload = getJwtPayload(req, res, next);
	if (payload) {
		const jwtUsername = payload.username;
		return jwtUsername;
	}
	return 'guest';
}

/**
 * Check if a password matches a hash.
 *
 * @param {string} password - The password to check.
 * @param {string} hash - The hash to compare against.
 * @returns {boolean} True if the password matches the hash, false otherwise.
 */
async function checkPassword(password, hash) {
	if (password && hash) {
		let pw = await bcrypt.compare(password, hash);
		return pw;
	} else return password === hash;
}

/**
 * Hash a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
	return await bcrypt.hash(password, salt);
}

/**
 * Verify the authenticity of a JWT token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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
