# Server

Your application server is used to handle backend and API requests for the application. There are two components associated with your application server:

* server/app.js
* server/server.js

This document will outline the functionality of each component, as well as how to run the server

## Running the Application Server

To run the application server, use the command `node server/server.js`. If the command is successful, you will see `Server started` output to the terminal.

## app.js

The file `app.js` contains an `AppServer` class which handles the setup of the `express` API backend. The class contains the following properties:

1. **host**: The address of the database server
2. **port**: The port of the database server
3. **user**: The username of your database user
4. **pass**: The password of your database user
5. **database**: The database for your application

The constructor of this class initializes the `express` component, setting it to use `express.json` and `cors`. The `AppServer` class also sets up the following reachable endpoints:

* /api/registration
* /api/login

### /api/registration endpoint

The registration endpoint requires the following parameters to be provided:

* **email**: The email of the user being registered to the application
* **user_password**: The password of the user being registered to the application
* **confirm_password**: This field must match `user_password`, to confirm the user typed their password correctly
* **first_name**: The first name of the user
* **last_name**: The last name of the user

This endpoint sets up a database connection, and attempts to register a new user using the `registerUser` method of the [auth](auth/auth.md) module. The endpoint can return the following statuses:

* **200**: The user was registered successfully
* **400**: The user already exists, or the `user_password` and `confirm_password` fields do not match
* **500**: The process for registering a new user failed due to an internal server error

