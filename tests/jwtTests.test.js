const request = require("supertest");
const server = require("../server/app.js")
const conf = require("../handlers/confHandler.js");
const sqlHandle = require("../handlers/DbHandler.js");
const auth = require("../utils/auth.js");

const params = conf.getDBParams();
const appServer = new server.appServer(params[0],params[1],params[2],params[3],"CmsSystemTest");

describe("Testing normal registration", () => {
    test("Valid JWT is successful", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":"123456"
            }
        );
        
        var cookie = res.headers['set-cookie'][0]
        var token = cookie.substring(cookie.indexOf("=")+1,cookie.indexOf(";"));
        var result = await auth.verify(token);

        expect(res.statusCode).toEqual(200);
        expect(result).toEqual(true);
    });

    test("Invalid JWT is successful", async () => {
        
        token = "A";
        var result = await auth.verify(token);
        expect(result).toEqual(false);
    });

    test("Blank JWT fails", async () => {
        
        token = "";
        var result = await auth.verify(token);
        expect(result).toEqual(false);
    });

});