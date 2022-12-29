const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');
const posts = require("../utils/posts");
const categories = require("../utils/categories");
const pages = require('../utils/pages');
const courses = require('../utils/courses');

module.exports.apiServer = class ApiServer{

    constructor(conf){
        this.conf = conf;

        this.app = express()
        this.app.use(express.json({limit: conf.postLimit}));

        this.app.use(cors({
            origin: [conf.serverAdress + ':' + conf.apiPort, conf.serverAddress],
            credentials:true
        }));
        
        this.app.set('view engine','ejs');
        this.app.use('/public',express.static(__dirname + '\\public'));

        this.app.post("/api/addCategory", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {category_name} = req.body;
                let result = await categories.addCategory(sqlConn,category_name);
                
                if (result[0]){
                    res.json({code:1, status:"Saved!",id:result[1]});
                }else{
                    res.json({code: -1, status:"Failed to save"});
                }

                res.end();
                
            }else{
                res.status(401);
                res.json({code:-1, status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/addPost", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin", conf);

            if (authRes[0]){
                console.log(req.body);
                
                const {title,data,categoryId} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else{
                    
                    let result = await posts.addPost(sqlConn,title,data,categoryId);
                
                    if (result){
                        res.json({code:1, status:"Saved!"});
                    }else{
                        res.json({code:-1, status:"Failed to save"});
                    }
                    }
                
            }else{
                res.status(401);
                res.json({code:-1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/addBlock", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {block_id, page_id,content,order} = req.body;
                console.log(page_id);
                let result = await pages.addBlock(sqlConn,block_id, page_id, content,order);
                
                if (result){
                    res.json({code:1, status:"Saved!"});
                }else{
                    res.json({code: -1, status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/nextBlockId", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {page_id} = req.body;
                let result = await pages.nextBlockId(sqlConn,page_id);
                
                if (result[0]){
                    res.json({code:1, status:"Success!",block_id:result[1], order:result[2]});
                }else{
                    res.json({code:1, status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({code:1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/editBlock", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {blockId,pageId,content} = req.body;
                let result = await pages.editBlock(sqlConn,blockId, content,pageId);
                
                if (result[0]){
                    res.json({code:1, status:"Saved!",block_id:result[1]});
                }else{
                    res.json({code: -1, status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/addCourse", async(req,res) => {

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {title,course_path} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else if (course_path == ''){
                    res.json({code:-1,status:"Path cannot be blank"});
                }else if (await courses.checkPath(sqlConn, course_path) == -1){
                    res.json({code:-1, status:"Page path already exists, select a unique path"});
                }else{
                    let result = await courses.addCourse(sqlConn,title,course_path);
                
                    if (result[0]){
                        res.json({code:1, status:"Saved!",course_id:result[1]});
                    }else{
                        res.json({code: -1, status:"Failed to save"});
                    }
                }  
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/addPage", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {title,page_path} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else if (page_path == ''){
                    res.json({code:-1,status:"Path cannot be blank"});
                }else if (await pages.checkPath(sqlConn, page_path) == -1){
                    res.json({code:-1, status:"Page path already exists, select a unique path"});
                }else{
                    let result = await pages.addPage(sqlConn,title,page_path);
                
                    if (result[0]){
                        res.json({code:1, status:"Saved!",page_id:result[1]});
                    }else{
                        res.json({code: -1, status:"Failed to save"});
                    }
                }  
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/deleteBlock/", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                const {block_id,page_id} = req.body;
                let result = await pages.deleteBlock(sqlConn,block_id, page_id);
                
                if (result){
                    res.json({code:1,status:"Deleted!"});
                }else{
                    res.json({code:-1,status:"Failed to delete"});
                }
                
            }else{
                res.status(401);
                res.json({code:1,status:"Requires authorization"});
            }
        });

        this.app.post("/api/deletePost/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                let result = await posts.deletePost(sqlConn,req.params.id);
                
                if (result){
                    res.json({code:1,status:"Deleted!"});
                }else{
                    res.json({code:-1,status:"Failed to delete"});
                }
                
            }else{
                res.status(401);
                res.json({code:-1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/deletePage/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                let result = await pages.deletePage(sqlConn,req.params.id);
                
                if (result){
                    res.json({code:1, status:"Deleted!"});
                }else{
                    res.json({code:-1, status:"Failed to delete"});
                }
                
            }else{
                res.status(401);
                res.json({code:-1,status:"Requires authorization"});
            }
        });

        this.app.post("/api/deleteCategory/:id", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                let result = await categories.deleteCategory(sqlConn,req.params.id);
                
                if (result){
                    res.json({code:1,status:"Deleted!"});
                    res.end();
                }else{
                    res.json({code:-1, status:"Failed to delete"});
                    res.end();
                }
                
            }else{
                res.status(401);
                res.json({code:-1,status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/editCategory", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {category_id, category_name} = req.body;
                let result = await categories.editCategory(sqlConn,category_id,category_name);
                
                if (result){
                    res.json({code:1,status:"Saved!", id:category_id});
                }else{
                    res.json({code:-1,status:"Failed to save"});
                }

                res.end();
                
            }else{
                res.status(401);
                res.json({code:-1,status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/updatePageOrder", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                const {block_id1, block_id2, page_id} = req.body;
                let result = await pages.updateOrder(sqlConn,block_id1, block_id2, page_id);
                
                if (result){
                    res.json({code:1, status:"Saved!"});
                }else{
                    res.json({code: -1, status:"Failed to save"});
                }

                res.end();
                
            }else{
                res.status(401);
                res.json({code:-1, status:"Requires authorization"});
                res.end();
            }
        });

        this.app.post("/api/editPageTitle", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                const {page_id,title} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else{
                    let result = await pages.editPageTitle(sqlConn,page_id,title);
                
                    if (result){
                        res.json({code: 1, status:"Saved!"});
                    }else{
                        res.json({code: -1, status:"Failed to save"});
                    }
                }
                
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });

        this.app.post("/api/editPost", async(req,res) => {
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {title,data,id,categoryId} = req.body;
                let result = await posts.editPost(sqlConn,title,data,id,categoryId);
                
                if (result){
                    res.json({code:1, status:"Saved!"});
                }else{
                    res.json({code: -1, status:"Failed to save"});
                }
                
            }else{
                res.status(401);
                res.json({code:-1,status:"Requires authorization"});
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
                        res.json({code:1, status:"User created successfully!"});
                    }else if (result == -2){
                        res.status(400);
                        res.json({code:-2, status:"User already exists, pick another username!"});
                    }else if (result == -3){
                        res.status(400);
                        res.json({code:-3,status:"Passwords provided do not match!"});
                    }else{
                        res.status(500);
                        res.json({code:-1, status:"Failed to register user!"});
                    }

                }catch(err){
                    res.status(500);
                    res.json({code:-1, status:"Failed to register user!"});
                }
            }else{
                res.status(404);
                res.json({code:-1,status:"Registration is not a valid endpoint"});
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
                    res.json({code:1, status:"Login successful!"});
                }else{
                    res.status(400);
                    res.json({code:-1, status:"Invalid username or password!"});
                }
            }catch(err){
                res.status(500);
                res.json({code:-1,status:"Failed to login!"});
            }
        });

    }
}


