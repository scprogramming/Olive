const server = require('../server/app.js');
const dotenv = require("dotenv");
const config = require("../utils/configuration")
const apiServer = require('../server/api')

dotenv.config();
conf = new config.Configuration(process.env);
conf.database = "cmssystemtest";

const appServer = new server.appServer(conf);
const api = new apiServer.apiServer(conf);

appServer.app.listen(process.env.serverPort, () => {
    console.log("Server started");
});

api.app.listen(process.env.apiPort, () => {
    console.log("API started");
});