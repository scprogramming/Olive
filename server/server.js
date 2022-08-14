const server = require('./app.js');
const dotenv = require("dotenv");
const config = require("../utils/configuration")

dotenv.config();
conf = new config.Configuration(process.env);

const appServer = new server.appServer(conf);

appServer.app.listen(process.env.serverPort, () => {
    console.log("Server started");
});