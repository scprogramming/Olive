const request = require("supertest");
const server = require("../server/app.js")
const conf = require("../handlers/confHandler.js");
const sqlHandle = require("../handlers/DbHandler.js");

const params = conf.getDBParams();
const appServer = new server.appServer(params[0],params[1],params[2],params[3],"CmsSystemTest");

describe("Testing normal registration", () => {
    test("Valid login is successful", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":"123456"
            }
        );

        expect(res.statusCode).toEqual(200);
        
    });

    test("Invalid login fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":"1234567"
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });

    test("Blank username fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"",
                "user_password":"1234567"
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });

    test("Blank password fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":""
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });

    test("SQL injection 1 fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"test@gmail.com",
                "user_password":"'"
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });

    test("SQL injection 2 fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "email":"'",
                "user_password":"1234567"
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });
});