const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');
const posts = require("../utils/posts");
const categories = require("../utils/categories");
const pages = require('../utils/pages');

module.exports.apiServer = class ApiServer{

    constructor(conf){
        this.conf = conf;

        this.app = express()
        this.app.use(express.json({limit: conf.postLimit}));

        this.app.use(cors({
            origin: ['http://localhost:5000', 'http://localhost'],
            credentials:true
        }));
        
        this.app.set('view engine','ejs');
        this.app.use('/public',express.static(__dirname + '\\public'));

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

        this.app.post("/api/addBlock", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                const {block_id, page_id,content,order} = req.body;
                console.log(page_id);
                let result = await pages.addBlock(sqlConn,block_id, page_id, content,order);
                
                if (result){
                    res.json({status:"Saved!"});
                }else{
                    res.json({status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
            }
        });

        this.app.post("/api/nextBlockId", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                const {page_id} = req.body;
                let result = await pages.nextBlockId(sqlConn,page_id);
                
                if (result[0]){
                    res.json({status:"Success!",block_id:result[1], order:result[2]});
                }else{
                    res.json({status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
            }
        });

        this.app.post("/api/editBlock", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                const {blockId,pageId,content,order} = req.body;
                let result = await pages.editBlock(sqlConn,blockId, content,order,pageId);
                
                if (result[0]){
                    res.json({status:"Saved!",block_id:result[1]});
                }else{
                    res.json({status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
            }
        });

        this.app.post("/api/addPage", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                const {title,page_path} = req.body;
                let result = await pages.addPage(sqlConn,title,page_path);
                
                if (result[0]){
                    res.json({status:"Saved!",page_id:result[1]});
                }else{
                    res.json({status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({status:"Requires authorization"});
            }
        });

        this.app.post("/api/deleteBlock/", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                const {block_id,page_id} = req.body;
                let result = await pages.deleteBlock(sqlConn,block_id, page_id);
                
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

        this.app.post("/api/deletePage/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                
                let result = await pages.deletePage(sqlConn,req.params.id);
                
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

        this.app.post("/api/editPageTitle", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                const {page_id,title} = req.body;
                let result = await pages.editPageTitle(sqlConn,page_id,title);
                
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

        this.app.post("/api/getPage/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin");

            if (authRes[0]){
                
                let result = await pages.getPageWithId(sqlConn, req.params.id);
                res.json(result[0]);
                
            }else{
                res.status(401);
                res.json("Requires authorization");
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


