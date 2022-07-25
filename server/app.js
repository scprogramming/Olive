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
                const {username, user_password, first_name, last_name, address, postal_zip_code} = req.body;
                
                
                var result = await auth.registerUser(username, user_password, first_name, last_name, address, postal_zip_code,sqlConn);
            
                if (result == 1){
                    res.status(200);
                    res.json("User created successfully!");
                }else if (result == -2){
                    res.status(400);
                    res.json("User already exists, pick another username!");
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
                const {username, user_password} = req.body;
                var result = await auth.login(username, user_password, sqlConn);

                if (result){
                    res.status(200);
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


