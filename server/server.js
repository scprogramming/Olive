const dotenv = require("dotenv");
const config = require("../utils/configuration")
const apiServer = require('./api')

dotenv.config();
conf = new config.Configuration(process.env);

const api = new apiServer.apiServer(conf);

api.app.listen(process.env.apiPort, () => {
    console.log("API started");
});