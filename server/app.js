const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');
const posts = require("../utils/posts");
const categories = require("../utils/categories");
const authRouter = require("./authRouter");

module.exports.appServer = class AppServer{

    constructor(conf){
        this.conf = conf;

        this.app = express()
        this.app.use(express.json({limit: conf.postLimit}));
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

        

        this.app.get("/dashboard/categories", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            let redirect = await authRouter.determineRedirectLogin("categories",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);
 
        });

        this.app.get("/dashboard/editPost/:id", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            let redirect = await authRouter.determineRedirectLogin("editPost",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);

                
           
        });

        this.app.get("/viewPost/:id", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            let result = await posts.getPostWithId(sqlConn,req.params.id);
            res.render("../views/pages/client/viewPost",{
                posts:result[0]
            });
        });

        this.app.get("/dashboard/posts", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            let redirect = await authRouter.determineRedirectLogin("posts",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
        });

        this.app.get("/", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            let result = await posts.getAllPosts(sqlConn);
            res.render("../views/pages/client/home",{
                posts:result[0]
            });
        });

        this.app.get("/dashboard/addPost", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            let redirect = await authRouter.determineRedirectLogin("addPost",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
           
        });

        this.app.get("/dashboard",function(req,res){
            res.render("../views/pages/dashboard/home");
    
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

        this.app.post("/api/addCategory", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                const {category_name} = req.body;
                let result = await categories.addCategory(sqlConn,category_name);
                
                if (result[0]){
                    res.json({status:"Saved!",id:result[1]});
                }else{
                    res.json({status:"Failed to save"});
                }

                res.end();
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/addPost", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                console.log(req.body);
                
                const {title,data,categoryId} = req.body;
                let result = await posts.addPost(sqlConn,title,data,categoryId);
                
                if (result){
                    res.json("Saved!");
                }else{
                    res.json("Failed to save");
                }
                
            }else{
                res.status(401);
                res.json("Requires authorization");
            }
        });

        this.app.post("/api/deletePost/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                let result = await posts.deletePost(sqlConn,req.params.id);
                
                if (result){
                    res.json("Deleted!");
                }else{
                    res.json("Failed to delete");
                }
                
            }else{
                res.status(401);
                res.json("Requires authorization");
            }
        });

        this.app.post("/api/deleteCategory/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                let result = await categories.deleteCategory(sqlConn,req.params.id);
                
                if (result){
                    res.json("Deleted!");
                    res.end();
                }else{
                    res.json("Failed to delete");
                    res.end();
                }
                
            }else{
                res.status(401);
                res.json("Requires authorization");
                res.end();
            }
        });

        this.app.post("/api/editCategory", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                const {category_id, category_name} = req.body;
                let result = await categories.editCategory(sqlConn,category_id,category_name);
                
                if (result){
                    res.json({status:"Saved!", id:category_id});
                }else{
                    res.json({status:"Failed to save"});
                }

                res.end();
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/editPost", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                const {title,data,id,categoryId} = req.body;
                let result = await posts.editPost(sqlConn,title,data,id,categoryId);
                
                if (result){
                    res.json("Saved!");
                }else{
                    res.json("Failed to save");
                }
                
            }else{
                res.status(401);
                res.json("Requires authorization");
            }
        });

        this.app.post("/api/registration", async(req,res) => {

            if (conf.registrationEnabled){
                var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                    conf.user,conf.pass,conf.database);

                try{
                    const {email, user_password, confirm_password, first_name, last_name} = req.body;
                    var result = await auth.registerUser(email, user_password, confirm_password, first_name, last_name, sqlConn,conf);
                
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

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            try{
                const {email, user_password} = req.body;
                var result = await auth.login(email, user_password, sqlConn,this.conf);

                if (result[0]){
                    res.status(200);
                    res.cookie('auth',result[1],{path:'/',httpOnly:true})
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


