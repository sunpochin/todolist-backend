//jshint esversion: 9

const https = require("https");
const http = require("http");
const fs = require("fs");

const app = require("./app");

const httpsOptions = {
	ca: fs.readFileSync("./private-files/certificates/multi_498484707.ca-bundle", "utf8"),
	cert: fs.readFileSync("./private-files/certificates/multi_498484707.crt", "utf8"),
	key: fs.readFileSync("./private-files/certificates/yesido_me.key", "utf8"),
};

// const httpsServer = https.createServer(httpsOptions, app);
// const httpServer = http.createServer(app);
//
// // const httpsPort = process.env.PORT || 8082;
// const httpPort = process.env.PORT;
// httpServer.listen(httpPort, () => {
// 	console.log("httpPort: ", httpPort);
//
// });
// httpsServer.listen(httpsPort, () => {
// 	console.log("httpSecure Port: ", httpsPort);
// });

http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'application/json');
	res.end('elastic beanstalk');
}).listen(process.env.PORT, () => {
	console.log("listen on : ", process.env.PORT);
});
