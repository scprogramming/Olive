const posts = require("../utils/posts");
const categories = require("../utils/categories");
const pages = require('../utils/pages');

module.exports.determineRedirectLogin =  async function determineRedirectLogin(page,status,sqlConn,req){
    if (status[0]){
        let result = "";
        switch(page){
            
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
                return ["../views/pages/dashboard/editPost",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    posts:result[0],
                    categories: cats[0]
                }];
            case "posts":
                result = await posts.getAllPosts(sqlConn);
                return ["../views/pages/dashboard/posts",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    posts:result[0]
                }];
            case "addPost":
                result = await categories.getAllCategories(sqlConn);
                return["../views/pages/dashboard/addPost",{
                    categories:result[0],
                    url:conf.serverAddress,
                    port:conf.apiPort}
                ];
            case "pages":
                result = await pages.getAllPages(sqlConn);
                return ["../views/pages/dashboard/pages", {
                    pages:result[0],
                    url:conf.serverAddress,
                    port:conf.apiPort
                }];
            case "addPage":
                return ["../views/pages/dashboard/addPage",{
                    url:conf.serverAddress,
                    port:conf.apiPort
                }];
            case "editPage":
                let dataContent = await pages.getAllContent(sqlConn,req.params.id);
                return ["../views/pages/dashboard/editPage",{
                    url:conf.serverAddress,
                    port:conf.apiPort,
                    pageId:req.params.id,
                    title:dataContent[1][0],
                    content:dataContent[0][0]
                }];
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