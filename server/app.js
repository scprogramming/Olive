const express = require("express");
const cors = require('cors');
const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');
const posts = require("../utils/posts");
const pages = require("../utils/pages");
const authRouter = require("./authRouter");

module.exports.appServer = class AppServer{

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

        this.app.get("/login", function(req,res){
            res.render("../views/pages/login", {
                url:conf.serverAddress,
                port:conf.apiPort,
                regEnable:conf.registrationEnabled
            });
        });

        

        this.app.get("/dashboard/categories", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("categories",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);
 
        });

        this.app.get("/dashboard/editPost/:id", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("editPost",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);

        });

        this.app.get("/dashboard/editPage/:id", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("editPage",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);

        });

        this.app.get("/dashboard/addBlock/:id/:type", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("addBlock",authRes, sqlConn,req);
            res.render(redirect[0],redirect[1]);

        });

        this.app.get("/dashboard/editBlock/:id/:type/:blockId", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("editBlock",authRes, sqlConn,req);
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
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("posts",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
        });

        this.app.get("/dashboard/pages", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("pages",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
        });

        this.app.get("/dashboard/addPage", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("addPage",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
        });

        this.app.get("/", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            let result = await posts.getAllPosts(sqlConn);
            let pageRes = await pages.getAllPages(sqlConn);

            res.render("../views/pages/client/home",{
                posts:result[0],
                pages:pageRes[0]
            });
        });

        this.app.get("/dashboard/addPost", async function(req,res){

            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            const cookie = req.headers.cookie;
            const authRes = await auth.verify(sqlConn, cookie, "admin",conf);

            let redirect = await authRouter.determineRedirectLogin("addPost",authRes, sqlConn);
            res.render(redirect[0],redirect[1]);
           
        });

        this.app.get("/dashboard",function(req,res){
            res.render("../views/pages/dashboard/home");
    
        });

        this.app.get("/pages/:path", async function(req,res){
            var sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
                conf.user,conf.pass,conf.database);

            let getPage = await pages.getPageWithPath(sqlConn, req.params.path);

            res.render("../views/pages/client/page",{
                page:getPage[0][0]
            });
        });

        this.app.get("/register", function(req,res){

            if (conf.registrationEnabled){
                res.render("../views/pages/register", {
                    url:conf.serverAddress,
                    port:conf.apiPort
                });
            }else{
                res.status(404);
            }
            
        });

    }
}


