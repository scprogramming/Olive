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
            origin: [conf.serverAddress + ':' + conf.apiPort, conf.serverAddress + ':4200', conf.serverAddress],
            credentials:true
        }));
        
        this.app.set('view engine','ejs');
        this.app.use('/public',express.static(__dirname + '\\public'));

        const storage = multer.diskStorage(
            {
                destination:'olive/src/assets/videos',
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
       

        /***************************************************************************************************************************/
                                                        /*Course API Endpoints*/
        /***************************************************************************************************************************/
        this.app.post("/api/addModule", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const {courseId,moduleTitle,cookie} = req.body;

            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
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

        this.app.post("/api/addLearningObjective", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId,learningObj} = req.body;
                let result = await courses.addLearningObjective(mongoConn,courseId,learningObj);
                
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

        this.app.post("/api/updateModuleTitle", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, moduleId,title} = req.body;
                let result = await courses.updateModuleTitle(mongoConn,courseId,moduleId, title);
                
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

        this.app.post("/api/updateLessonTitle", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, moduleId,title, lessonId} = req.body;
                let result = await courses.updateLessonTitle(mongoConn,courseId, moduleId,title, lessonId);
                
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

        

        this.app.post("/api/deleteModule", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, moduleId} = req.body;
                let result = await courses.deleteModule(mongoConn,courseId,moduleId);
                
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

        this.app.post("/api/deleteLesson", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, moduleId, lessonId} = req.body;
                let result = await courses.deleteLesson(mongoConn,courseId,moduleId, lessonId);
                
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


        this.app.post("/api/deleteAudience", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, audienceId} = req.body;
                let result = await courses.deleteAudience(mongoConn,courseId,audienceId);
                
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

        this.app.post("/api/deleteLearningObjective", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, learningObj} = req.body;
                let result = await courses.deleteLearningObjecive(mongoConn,courseId,learningObj);
                
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

        this.app.post("/api/deleteRequirements", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, requirementId} = req.body;
                let result = await courses.deleteRequirements(mongoConn,courseId,requirementId);
                
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

        this.app.post("/api/updateLearningObj", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, title,id} = req.body;
                let result = await courses.updateLearningObj(mongoConn,courseId,title,id);
                
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

        this.app.post("/api/updateAudience", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, title,id} = req.body;
                let result = await courses.updateAudience(mongoConn,courseId,title,id);
                
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

        this.app.post("/api/updateRequirements", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId, title,id} = req.body;
                let result = await courses.updateRequirements(mongoConn,courseId,title,id);
                
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

        this.app.post("/api/newRequirement", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId,requirement} = req.body;
                let result = await courses.addRequirement(mongoConn,courseId,requirement);
                
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

        this.app.post("/api/newAudience", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                const {courseId,audience} = req.body;
                let result = await courses.addAudience(mongoConn,courseId,audience);
                
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

        
        

        this.app.post("/api/addPaymentOption", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
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

        this.app.post("/api/deletePaymentOption", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                let {courseId, paymentId} = req.body;

                let result = await courses.deletePaymentPlan(mongoConn,courseId, paymentId);

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

        this.app.post("/api/uploadVideo", upload.array('video'), async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const cookie = req.body.auth;
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
            const {courseId,lessonTitle,moduleId, cookie} = req.body;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
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

        this.app.post("/api/addCourse", async(req,res) => {

            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            const {title,course_path,thumbnail, courseDesc, cookie} = req.body;

            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                

                if (title === ''){
                    res.json({code:-1,status:"Failed to save, title cannot be empty"});
                }else if (course_path == ''){
                    res.json({code:-1,status:"Path cannot be blank"});
                }else if (await courses.checkPath(mongoConn, course_path) == -1){
                    res.json({code:-1, status:"Page path already exists, select a unique path"});
                }else{
                    let result = await courses.addCourse(mongoConn,title,course_path,thumbnail,courseDesc);
                
                    if (result[0]){
                        res.json({code:1, status:"Saved!",id:result[1]});
                    }else{
                        res.json({code: -1, status:"Failed to save"});
                    }
                }  
            }else{
                res.status(401);
                res.json({code: -1, status:"Requires authorization"});
            }
        });    

        this.app.post("/api/deleteCourse/:id", async(req,res) => {
            var mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(mongoConn, cookie, "admin",conf);

            if (authRes[0]){
                
                let result = await courses.deleteCourse(mongoConn,req.params.id);
                
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

        /********************************************************************************************************************************* 
         *                                                  User Facing API Calls
         * 
        /********************************************************************************************************************************* */
        
        this.app.get("/api/getDashboardCourses", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            let result = await courses.getAllCourses(mongoConn);

            const resultSet = [];

            for (let i = 0; i < result.length; i++){
                resultSet.push({_id:result[i]._id.toString(), course_title:result[i].course_title, courseDesc:result[i].courseDesc, 
                    thumbnail:result[i].thumbnail,course_path:result[i].course_path, date_created: result[i].date_created});
            }

            res.json(resultSet);
            res.end();

        });

        this.app.get("/api/courseData/:id", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            let result = await courses.getContentWithPath(mongoConn,req.params.id);

            const resultSet = {course_title:result.course_title,courseDesc:result.courseDesc,learning_objective:result.learning_objectives,
            content:result.modules, audience:result.audience, requirements:result.requirements, payment_options:result.payment_options
            };

            

            res.json(resultSet);
            res.end();
        });
        
        this.app.get("/api/courseDataWithId/:id", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            let result = await courses.getAllContent(mongoConn,req.params.id);

            const resultSet = {course_title:result.course_title,courseDesc:result.courseDesc,learning_objective:result.learning_objectives,
            content:result.modules, audience:result.audience, requirements:result.requirements, payment_options:result.payment_options
            };

            

            res.json(resultSet);
            res.end();
        });

        /********************************************************************************************************************************* 
         *                                                  Authentication endpoints
         * 
        /********************************************************************************************************************************* */

        this.app.post("/api/verifyAuthUser", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const {authToken} = req.body;
            const authRes = await auth.verify(mongoConn, authToken, "user",conf);

            if (authRes[0]){
                    res.json({status:true});
            }else{
                res.json({status:false});
            }
        });

        this.app.post("/api/verifyAuthAdmin", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            const {authToken} = req.body;
            const authRes = await auth.verify(mongoConn, authToken, "admin",conf);

            if (authRes[0]){
                    res.json({status:true});
            }else{
                res.json({status:false});
            }
        });

        this.app.post("/api/register", async(req,res) => {

            if (conf.registrationEnabled){
                let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
                try{
                    const {email, password, confirmPassword} = req.body;

                    if (email === '' || password === '' || confirmPassword === ''
                    || email === undefined || password === undefined || confirmPassword === undefined){
                        res.status(200);
                        res.json({code:-1, status:"All fields must have a value to register"});
                    }else{
                        let result = await auth.registerUser(email, password, confirmPassword, mongoConn,conf);
                        let authRes = await auth.login(email, password, mongoConn,this.conf.tokenExpires);
                        if (result == 1){
                            res.status(200);
                            res.json({code:1, auth:authRes[1], status:"User created successfully!"});
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
    
                    }
                    
                }catch(err){
                    res.status(500);
                    console.error(err);
                    res.json({code:-1, status:"Failed to register user!"});
                }
            }else{
                res.status(404);
                res.json({code:-1,status:"Registration is not a valid endpoint"});
            }

            });

        this.app.post("/api/logout", async(req,res) => {
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);
            auth.logout(mongoConn,req.body.token);
            res.end();
        });

        this.app.post("/api/login", async(req,res) => {
            
            let mongoConn = new mongoHandle.MongoDbHandler(conf.host,conf.port, conf.user, conf.pass, conf.database);

            try{
                const {email, password} = req.body;
                var result = await auth.login(email, password, mongoConn,this.conf.tokenExpires);

                if (result[0]){
                    res.status(200);
                    res.json({code:1, auth:result[1], status:"Login successful!"});
                }else{
                    res.status(200);
                    res.json({code:-1, status:"Invalid username or password!"});
                }
            }catch(err){
                res.status(500);
                res.json({code:-1,status:"Failed to login!"});
            }
        });

    }
}


