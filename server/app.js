const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');

module.exports.appServer = class AppServer{

    constructor(conf){
        this.conf = conf;

        this.app = express()
        this.app.use(express.json());
        this.app.use(cors());
        this.app.set('view engine','ejs');
        this.app.use('/public',express.static(__dirname + '\\public'));

        this.app.get("/login", function(req,res){
            res.render("../views/pages/login", {
                url:conf.serverAddress,
                port:conf.serverPort,
                regEnable:conf.registrationEnabled
            });
        });

        this.app.get("/register", function(req,res){

            if (conf.registrationEnabled){
                res.render("../views/pages/register", {
                    url:conf.serverAddress,
                    port:conf.serverPort
                });
            }else{
                res.status(404);
            }
            
        })

        this.app.post("/api/registration", async(req,res) => {

            if (conf.registrationEnabled){
                var sqlConn = new sqlHandle.SqlHandler(this.conf.host,this.conf.port,
                    this.conf.user,this.conf.pass,this.conf.database);

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
            }else{
                res.status(404);
                res.json("Registration is not a valid endpoint");
            }

            });
        

        this.app.post("/api/login", async(req,res) => {

            var sqlConn = new sqlHandle.SqlHandler(this.conf.host,this.conf.port,
                this.conf.user,this.conf.pass,this.conf.database);

            try{
                const {email, user_password} = req.body;
                var result = await auth.login(email, user_password, sqlConn,this.conf);

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


