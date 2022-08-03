const request = require("supertest");
const conf = require("../handlers/confHandler.js");
const sqlHandle = require("../handlers/DbHandler.js");
const server = require("../server/app.js")

const params = conf.getDBParams();
const appServer = new server.appServer(params[0],params[1],params[2],params[3],"CmsSystemTest");

module.exports = async () => {
    var sqlConn = new sqlHandle.SqlHandler(params[0],params[1],params[2],params[3],"CmsSystemTest");
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
