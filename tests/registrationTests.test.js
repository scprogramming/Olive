const request = require("supertest");
const server = require("../server/app.js")
const sqlHandle = require("../handlers/DbHandler.js");
const dotenv = require("dotenv");
const config = require("../utils/configuration")

dotenv.config();

conf = new config.Configuration(process.env);
conf.database = 'CmsSystemTest';


const appServer = new server.appServer(conf);

describe("Testing normal registration", () => {
    test("We should be able to register a user", async () => {
        
        const res = await request(appServer.app)
        .post('/api/registration')
        .send(
            {
                "email":"scottc130@gmail.com",
                "user_password":"123456",
                "confirm_password":"123456",
                "first_name":"Scott",
                "last_name":"Cosentino"
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
                "email":"scottc130@gmail.com",
                "user_password":"123456",
                "confirm_password":"123456",
                "first_name":"Scott",
                "last_name":"Cosentino"
            }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual("User already exists, pick another username!")
    });

    test("Database contains user details", async () => {

        var sqlConn = new sqlHandle.SqlHandler(process.env.databaseAddress,
            process.env.databasePort,process.env.databaseUser,process.env.databasePassword,"CmsSystemTest");
        var result = await sqlConn.queryReturnNoParam("SELECT * FROM user_login WHERE email = 'scottc130@gmail.com'");
        
        expect(result[0][0].email).toEqual("scottc130@gmail.com");
        expect(result[0][0].active).toEqual(1);
        expect(result[0][0].role).toEqual("user");

        result = await sqlConn.queryReturnNoParam("SELECT * FROM user_details WHERE first_name = 'Scott'");

        expect(result[0][0].first_name).toEqual("Scott");
        expect(result[0][0].last_name).toEqual("Cosentino");

    });
});