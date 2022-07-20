const request = require("supertest");
const server = require("../server/app.js")
const conf = require("../handlers/confHandler.js");
const sqlHandle = require("../handlers/DbHandler.js");

const params = conf.getDBParams();
const appServer = new server.appServer(params[0],params[1],params[2],params[3],"CmsSystemTest");

beforeAll(() => {
    var sqlConn = new sqlHandle.SqlHandler(params[0],params[1],params[2],params[3],"CmsSystemTest");
    sqlConn.queryReturnNoParam("TRUNCATE TABLE user_login");
    sqlConn.queryReturnNoParam("TRUNCATE TABLE user_details")
    sqlConn.close();
});

describe("Testing normal registration", () => {
    test("We should be able to register a user", async () => {
        
        const res = await request(appServer.app)
        .post('/api/registration')
        .send(
            {
                "username":"Scott",
                "user_password":"123456",
                "first_name":"Scott",
                "last_name":"Cosentino",
                "address":"123 Street",
                "postal_zip_code":"000000"
            }
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual("User created successfully!")
    });

    test("Valid login is successful", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "username":"Scott",
                "user_password":"123456",
            }
        );

        expect(res.statusCode).toEqual(200);
    });

    test("Invalid login fails", async () => {
        
        const res = await request(appServer.app)
        .post('/api/login')
        .send(
            {
                "username":"Scott",
                "user_password":"1234567",
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
                "username":"",
                "user_password":"1234567",
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
                "username":"Scott",
                "user_password":"",
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
                "username":"Scott",
                "user_password":"'",
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
                "username":"'",
                "user_password":"1234567",
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("Invalid username or password!")
    });
});