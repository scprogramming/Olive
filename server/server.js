const server = require('./app.js');
const dotenv = require("dotenv");

dotenv.config();

const appServer = new server.appServer(process.envdatabaseAddress,
    process.env.databasePort,process.env.databaseUser,process.env.databasePassword,process.env.database);

appServer.app.listen(5000, () => {
    console.log("Server started");
});