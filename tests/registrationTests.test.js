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

    test("Duplicate users are not allowed", async () => {
        
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

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("User already exists, pick another username!")
    });

    test("Database contains user details", async () => {

        var sqlConn = new sqlHandle.SqlHandler(params[0],params[1],params[2],params[3],"CmsSystemTest");
        var result = await sqlConn.queryReturnNoParam("SELECT * FROM user_login WHERE username = 'Scott'");
        
        expect(result[0][0].username).toEqual("Scott");
        expect(result[0][0].active).toEqual(1);
        expect(result[0][0].role).toEqual("user");

        result = await sqlConn.queryReturnNoParam("SELECT * FROM user_details WHERE first_name = 'Scott'");

        expect(result[0][0].first_name).toEqual("Scott");
        expect(result[0][0].last_name).toEqual("Cosentino");
        expect(result[0][0].address).toEqual("123 Street");
        expect(result[0][0].postal_zip_code).toEqual("000000");

        sqlConn.close();
    });
});