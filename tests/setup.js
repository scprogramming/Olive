const request = require("supertest");
const sqlHandle = require("../handlers/DbHandler.js");
const server = require("../server/app.js")

const dotenv = require("dotenv");
const config = require("../utils/configuration")

dotenv.config();

conf = new config.Configuration(process.env);
conf.database = 'CmsSystemTest';


const appServer = new server.appServer(conf);

module.exports = async () => {
    var sqlConn = new sqlHandle.SqlHandler(process.env.databaseAddress,
        process.env.databasePort,process.env.databaseUser,process.env.databasePassword,"CmsSystemTest");
    sqlConn.queryReturnNoParam("TRUNCATE TABLE user_login");
    sqlConn.queryReturnNoParam("TRUNCATE TABLE user_details");
    const res = await request(appServer.app)
        .post('/api/registration')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":"123456",
                "confirm_password":"123456",
                "first_name":"Scott",
                "last_name":"Cosentino"
            }
        );
};
