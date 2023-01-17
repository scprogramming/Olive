const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const posts = require("../utils/posts");
const categories = require("../utils/categories");
const pages = require('../utils/pages');
const courses = require('../utils/courses');
const mongoHandle = require('../handlers/MongoDbHandler.js');

const multer = require('multer');


module.exports.apiServer = class ApiServer{

    constructor(conf){
        this.conf = conf;
        
        this.app = express()
        this.app.use(express.json({limit: conf.postLimit}));

        this.app.use(cors({
            origin: [conf.serverAddress + ':' + conf.apiPort, conf.serverAddress],
            credentials:true
        }));
        
        this.app.set('view engine','ejs');
        this.app.use('/public',express.static(__dirname + '\\public'));

        const storage = multer.diskStorage(
            {
                destination:'server/public/uploads/',
                filename: function(req, file, cb){
                    const orgName = file.originalname
                    const indexOfExtension = orgName.indexOf('.')
                    cb(null, orgName.substring(0,indexOfExtension) + '-' + Date.now() + orgName.substring(indexOfExtension));
                }
            }
        )
        const upload = multer({storage:storage, 
            limits:{fileSize: conf.videoSizeLimit},
        });
       

        this.app.post("/api/addModule", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId,moduleTitle} = req.body;
                let result = await courses.addModule(mongoConn,courseId,moduleTitle);
                
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


        this.app.post("/api/addPaymentOption", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                let courseId = req.body.courseId;
                let planName = req.body.planName;
                let planType = req.body.planType;
                let currency = '';
                let payAmount = '';
                let frequency = '';

                switch (req.body.planType){
                    case 'One-time':
                        currency = req.body.currency;
                        payAmount = req.body.payAmount;
                        break;
                    case 'Subscription':
                        currency = req.body.currency;
                        payAmount = req.body.payAmount;
                        frequency = req.body.frequency;
                        break;
                }

                let result = await courses.savePaymentPlan(mongoConn,courseId, planName, planType, currency, payAmount, frequency);

                if (result[0]){
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

        this.app.post("/api/uploadLessonRichText", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);


            if (authRes[0]){
                let {data,courseId,moduleId,lessonId} = req.body;
                let result = await courses.saveRichText(mongoConn,data, courseId, moduleId, lessonId);

                if (result[0]){
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

        this.app.post("/api/uploadVideo", upload.array('video'), async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);


            if (authRes[0]){
                let result = await courses.saveVideo(mongoConn,req.files, req.body.lessonId, req.body.moduleId, req.body.courseId);
                
                if (result[0]){
                    res.json({code:1, status:"Saved!",video:result[1]});
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

        this.app.post("/api/addLesson", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId,lessonTitle,moduleId} = req.body;
                let result = await courses.addLesson(mongoConn,courseId,lessonTitle,moduleId);
                
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

        this.app.post("/api/editBlock", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {blockId,pageId,content} = req.body;
                let result = await pages.editBlock(mongoConn,blockId, content,pageId);
                
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

            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {title,course_path} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else if (course_path == ''){
                    res.json({code:-1,status:"Path cannot be blank"});
                }else if (await courses.checkPath(mongoConn, course_path) == -1){
                    res.json({code:-1, status:"Page path already exists, select a unique path"});
                }else{
                    let result = await courses.addCourse(mongoConn,title,course_path);
                
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

        

        this.app.post("/api/deleteBlock/", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {block_id,page_id} = req.body;
                let result = await pages.deleteBlock(mongoConn,block_id, page_id);
                
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
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                let result = await posts.deletePost(mongoConn,req.params.id);
                
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
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                let result = await pages.deletePage(mongoConn,req.params.id);
                
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

        

        this.app.post("/api/updatePageOrder", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                const {block_id1, block_id2, page_id} = req.body;
                let result = await pages.updateOrder(mongoConn,block_id1, block_id2, page_id);
                
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

        this.app.post("/api/addBlock", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {page_id,content,order} = req.body;

                let result = await pages.addBlock(mongoConn,page_id, content,order);
                
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

        this.app.post("/api/addPage", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {title,page_path} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else if (page_path == ''){
                    res.json({code:-1,status:"Failed to save, path cannot be blank"});
                }else if (await pages.checkPath(mongoConn, page_path) == -1){
                    res.json({code:-1, status:"Failed to save, page path already exists, select a unique path"});
                }else{
                    let result = await pages.addPage(mongoConn,title,page_path);
                
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

        this.app.post("/api/editPageTitle", async(req,res) => {
            var mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                const {page_id,title} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else{
                    let result = await pages.editPageTitle(mongoConn,page_id,title);
                
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

        this.app.post("/api/deleteCategory/:id", async(req,res) => {
            var mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                let result = await categories.deleteCategory(mongoConn,req.params.id);
                
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
        
        this.app.post("/api/addCategory", async(req,res) => {
            var mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {category_name} = req.body;
                let result = await categories.addCategory(mongoConn,category_name);
                
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

        this.app.post("/api/editCategory", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {category_id, category_name} = req.body;
                let result = await categories.editCategory(mongoConn,category_id,category_name);
                
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


        this.app.post("/api/addPost", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin", conf);

            if (authRes[0]){
                const {title,data,category} = req.body;

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else{
                    
                    let result = await posts.addPost(mongoConn,title,data,category);
                
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

        this.app.post("/api/editPost", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                
                const {title,data,id,categoryId} = req.body;
                let result = await posts.editPost(mongoConn,title,data,id,categoryId);
                
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
                let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
                try{
                    const {email, user_password, confirm_password, first_name, last_name} = req.body;
                    var result = await auth.registerUser(email, user_password, confirm_password, first_name, last_name, mongoConn,conf);
                
                    if (result == 1){
                        res.status(200);
                        res.json({code:1, status:"User created successfully!"});
                    }else if (result == -2){
                        res.status(400);
                        res.json({code:-2, status:"User already exists, pick another email!"});
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

            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            try{
                const {email, user_password} = req.body;
                var result = await auth.login(email, user_password, mongoConn,this.conf.tokenExpires);

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


