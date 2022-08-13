const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');

module.exports.appServer = class AppServer{

    constructor(host,port,user,pass,database){
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.database = database;

        this.app = express()
        this.app.use(express.json());
        this.app.use(cors());

        this.app.post("/api/registration", async(req,res) => {

            var sqlConn = new sqlHandle.SqlHandler(this.host,this.port,this.user,this.pass,this.database);

            try{
                const {email, user_password, confirm_password, first_name, last_name} = req.body;
                
                
                var result = await auth.registerUser(email, user_password, confirm_password, first_name, last_name, sqlConn);
            
                if (result == 1){
                    res.status(200);
                    res.json("User created successfully!");
                }else if (result == -2){
                    res.status(400);
                    res.json("User already exists, pick another username!");
                }else if (result == -3){
                    res.status(400);
                    res.json("Passwords provided do not match!");
                }else{
                    res.status(500);
                    res.json("Failed to register user!");
                }

            }catch(err){
                res.status(500);
                res.json("Failed to register user!");
            }
        });

        this.app.post("/api/login", async(req,res) => {

            var sqlConn = new sqlHandle.SqlHandler(this.host,this.port,this.user,this.pass,this.database);

            try{
                const {email, user_password} = req.body;
                var result = await auth.login(email, user_password, sqlConn);

                if (result[0]){
                    res.status(200);
                    res.setHeader('Set-Cookie','auth=' + result[1] + '; HttpOnly');
                    res.json("Login successful!");
                }else{
                    res.status(400);
                    res.json("Invalid username or password!");
                }
            }catch(err){
                res.status(500);
                res.json("Failed to login!");
            }
        });

    }
}

