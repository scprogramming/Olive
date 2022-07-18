import * as supertest from 'supertest';
import {app} from './server/server.js';
import {testMode} from './handlers/confHandler.js';

describe("Testing normal registration", () => {
    testMode = true;
    test("We should be able to register a user", async () => {
        
        const res = await request(app)
        .post('/registration')
        .send(
            {
                "username":"Scott10",
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
    testMode = false;
});