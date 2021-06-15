const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		// Authorization: 'Bearer TOKEN'
		console.log("req headers: ", req.headers);
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw Error("Ayth failed", 401);
		}
		const decodedToken = jwt.verify(token, "dontshare");
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		console.log("check-auth: ", err);
		const error = new HttpError("Auth Failed.", 403);
		return next(error);
	}
};
