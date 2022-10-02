const auth = require('../utils/auth.js');
const sqlHandle = require('../handlers/DbHandler.js');
const posts = require("../utils/posts");
const categories = require("../utils/categories");
const authRouter = require("./authRouter");


module.exports.determineRedirectLogin =  async function determineRedirectLogin(page,status,sqlConn,req){
    if (status[0]){
        let result = "";
        switch(page){
            
            case "categories":                        
                result = await categories.getAllCategories(sqlConn);

                return ["../views/pages/dashboard/categories", {
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    cats:result[0]
                }];
            case "editPost":
                result = await posts.getPostWithId(sqlConn,req.params.id);
                let cats = await categories.getAllCategories(sqlConn);
                return ["../views/pages/dashboard/editPost",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    posts:result[0],
                    categories: cats[0]
                }];
            case "posts":
                result = await posts.getAllPosts(sqlConn);
                return ["../views/pages/dashboard/posts",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    posts:result[0]
                }];
            case "addPost":
                result = await categories.getAllCategories(sqlConn);
                return["../views/pages/dashboard/addPost",{
                    categories:result[0],
                    url:conf.serverAddress,
                    port:conf.serverPort}
                ];
        }
    }else{
        switch(status[1]){
            case 1:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    regEnable:conf.registrationEnabled
                }];
            case 2:
                return ["../views/pages/pageNotFound",{}]
            case 3:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    regEnable:conf.registrationEnabled
                }];
            case 4:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    regEnable:conf.registrationEnabled
                }];
            case 5:
                return ["../views/pages/login",{
                    url:conf.serverAddress,
                    port:conf.serverPort,
                    regEnable:conf.registrationEnabled
                }];
            case 6:
            return ["../views/pages/login",{
                url:conf.serverAddress,
                port:conf.serverPort,
                regEnable:conf.registrationEnabled
            }];
        }
    }
}