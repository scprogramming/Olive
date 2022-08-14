const request = require("supertest");
const server = require("../server/app.js");
const auth = require("../utils/auth.js");
const dotenv = require("dotenv");
const config = require("../utils/configuration")

dotenv.config();

conf = new config.Configuration(process.env);
conf.database = 'CmsSystemTest';

const appServer = new server.appServer(conf);

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