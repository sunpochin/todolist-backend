//jshint esversion: 9
// const https = require("https");
const http = require("http");
const fs = require("fs");
const app = require("./app");

// const httpsOptions = {
//   ca: fs.readFileSync("./private-files/certificates/multi_498484707.ca-bundle", "utf8"),
//   cert: fs.readFileSync("./private-files/certificates/multi_498484707.crt", "utf8"),
//   key: fs.readFileSync("./private-files/certificates/yesido_me.key", "utf8"),
// };

const httpPort = process.env.PORT || 8081;
const httpServer = http.createServer(app);
httpServer.listen(httpPort, () => {
	console.log("httpPort: ", httpPort);
});

// const httpServer = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-type", "application/json");
//   res.end({
//     "port": "http"
//   });
// });
// const httpsServer = https.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-type", "application/json");
//   res.end({
//     "port": "secure port"
//   });
// });



// const httpsPort = process.env.PORT || 8082;
// // secureServer.listen(httpsPort, () => {
// //   console.log("listen on : ", httpsPort);
// // });
//
// // const httpsPort = process.env.PORT || 8082;
// // httpServer.listen(httpPort, () => {
// // 	console.log("httpPort: ", httpPort);
// // });
// const httpsServer = https.createServer(httpsOptions, app);
// httpsServer.listen(httpsPort, () => {
// 	console.log("httpSecure Port: ", httpsPort);
// });
