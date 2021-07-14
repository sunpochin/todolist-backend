//jshint esversion: 9

const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

module.exports = async(req, res, next) => {
	console.log('req.userData: ', req.userData);
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		// Authorization: 'Bearer TOKEN'
		console.log("req headers: ", req.headers);
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			console.log("null token: ");
			throw Error("Auth failed", 401);
		} else {
			// const { token }  = req.body;
	    // const ticket = await oAuth2Client.verifyIdToken({
	    //     idToken: token,
	    //     audience: process.env.CLIENT_ID
	    // });
			// console.log("token: ", token, ", ticket info: ", ticket);
			const decodedToken = jwt.verify(token, "dontshare");
			req.userData = { userId: decodedToken.userId };
			next();
		}
	} catch (err) {
		console.log("check-auth: ", err);
		const error = new HttpError("Auth Failed.", 403);
		return next(error);
	}
};
