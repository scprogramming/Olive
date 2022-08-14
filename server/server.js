const server = require('./app.js');
const dotenv = require("dotenv");
const config = require("../utils/configuration")

dotenv.config();
conf = new config.Configuration(process.env.databaseAddress,
    process.env.databasePort,process.env.databaseUser,process.env.databasePassword,process.env.database,
    process.env.serverAddress, process.env.serverPort);

const appServer = new server.appServer(conf);

appServer.app.listen(process.env.serverPort, () => {
    console.log("Server started");
});