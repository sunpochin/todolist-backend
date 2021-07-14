//jshint esversion: 9

const https = require("https");
const http = require("http");
const fs = require("fs");

const app = require("./app");

const httpPort = 8081;
const httpsPort = 8082;

const httpsOptions = {
	ca: fs.readFileSync("./private-files/certificates/multi_498484707.ca-bundle", "utf8"),
	cert: fs.readFileSync("./private-files/certificates/multi_498484707.crt", "utf8"),
	key: fs.readFileSync("./private-files/certificates/yesido_me.key", "utf8"),
};

const httpsServer = https.createServer(httpsOptions, app);
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
	console.log("httpPort: ", httpPort);
});
httpsServer.listen(httpsPort, () => {
	console.log("httpSecure Port: ", httpsPort);
});
