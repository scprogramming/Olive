const posts = require("../utils/posts");
const categories = require("../utils/categories");
const pages = require('../utils/pages');
const courses = require('../utils/courses');

module.exports.determineRedirectLogin =  async function determineRedirectLogin(page,status,sqlConn,req){
    if (status[0]){
        let result = "";
        switch(page){
            case "editCourse":
                let courseContent = await courses.getAllContent(sqlConn,req.params.id);
                console.log(courseContent[1]);
                if (courseContent[0] === ""){
                    return ["../views/pages/pageNotFound"]
                }else{
                    return ["../views/pages/dashboard/course/editCourse",{
                        url:conf.serverAddress,
                        port:conf.apiPort,
                        courseId:req.params.id,
                        title:courseContent[0],
                        content:courseContent[1]
                    }];
                }
            case "addCourse":
                return ["../views/pages/dashboard/course/addCourse",{
                    url:conf.serverAddress,
                    port:conf.apiPort
                }];
            case "courses":
                result = await courses.getAllCourses(sqlConn);

                return ["../views/pages/dashboard/course/courses",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    courses:result[0][0]
                }];
            case "categories":                        
                result = await categories.getAllCategories(sqlConn);

                return ["../views/pages/dashboard/categories", {
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    cats:result[0]
                }];
            case "editPost":
                result = await posts.getPostWithId(sqlConn,req.params.id);
                let cats = await categories.getAllCategories(sqlConn);
                return ["../views/pages/dashboard/post/editPost",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    posts:result[0],
                    categories: cats[0]
                }];
            case "posts":
                result = await posts.getAllPosts(sqlConn);
                return ["../views/pages/dashboard/post/posts",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    posts:result[0]
                }];
            case "addPost":
                result = await categories.getAllCategories(sqlConn);
                return["../views/pages/dashboard/post/addPost",{
                    categories:result[0],
                    url:conf.serverAddress,
                    port:conf.apiPort}
                ];
            case "pages":
                result = await pages.getAllPages(sqlConn);
                return ["../views/pages/dashboard/page/pages", {
                    pages:result[0],
                    url:conf.serverAddress,
                    port:conf.apiPort
                }];
            case "addPage":
                return ["../views/pages/dashboard/page/addPage",{
                    url:conf.serverAddress,
                    port:conf.apiPort
                }];
            case "addBlock":
                result = await pages.getBlock(sqlConn, req.params.type,'add');

                return ["../views/pages/dashboard/page/addBlock",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    content:result[0],
                    scripts:result[1],
                    pageId:req.params.id
                }];
            case "editBlock":
                result = await pages.getBlock(sqlConn, req.params.type,'edit');
                const existingContent = await pages.getBlockContent(sqlConn, req.params.id, req.params.blockId);

                return ["../views/pages/dashboard/page/editBlock",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    content:result[0],
                    scripts:result[1],
                    pageId:req.params.id,
                    blockId: req.params.blockId,
                    editContent: existingContent
                }];
            case "editPage":
                let dataContent = await pages.getAllContent(sqlConn,req.params.id);
                
                if (dataContent[1][0].length == 0){
                    return ["../views/pages/pageNotFound"]
                }else{
                    return ["../views/pages/dashboard/page/editPage",{
                        url:conf.serverAddress,
                        port:conf.apiPort,
                        pageId:req.params.id,
                        title:dataContent[1][0],
                        content:dataContent[0][0]
                    }];
                }
                
        }
    }else{
        switch(status[1]){
            case 1:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    regEnable:conf.registrationEnabled
                }];
            case 2:
                return ["../views/pages/pageNotFound",{}]
            case 3:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    regEnable:conf.registrationEnabled
                }];
            case 4:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    regEnable:conf.registrationEnabled
                }];
            case 5:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    regEnable:conf.registrationEnabled
                }];
            case 6:
            return ["../views/pages/login",{
                url:conf.serverAddress,
                port:conf.apiPort,
                regEnable:conf.registrationEnabled
            }];
        }
    }
}