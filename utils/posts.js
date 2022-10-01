const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addPost = async function addPost(sqlConn,title,data){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(post_id) AS max_id FROM posts`);
        let targetId = int(getNextId[0][0].max_id) + 1

        await sqlConn.queryReturnWithParams(`INSERT INTO posts(post_id,article_title,content,date_created)
        VALUES (?,?,?,?)`,[targetId,title,data, yyyy + '-' + mm + '-' + dd]);
        
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllPosts = async function getAllPosts(sqlConn){

    try{
        let posts = await sqlConn.queryReturnNoParam(`
        SELECT * FROM posts`);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getPostWithId = async function getPostWithId(sqlConn,id){

    try{
        let posts = await sqlConn.queryReturnWithParams(`
        SELECT * FROM posts WHERE post_id=?`,[id]);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 