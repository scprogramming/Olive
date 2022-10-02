const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addPost = async function addPost(sqlConn,title,data,categoryId){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(post_id) AS max_id FROM posts`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }
         

        await sqlConn.queryReturnWithParams(`INSERT INTO posts(post_id,article_title,content,date_created,category_id)
        VALUES (?,?,?,?,?)`,[targetId,title,data, yyyy + '-' + mm + '-' + dd,categoryId]);
        
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.editPost = async function editPost(sqlConn,title,data,id, category){

    try{
        await sqlConn.queryReturnWithParams(`
        UPDATE posts SET content = ? WHERE post_id = ?`,[data,id]);
        await sqlConn.queryReturnWithParams(`
        UPDATE posts SET article_title = ? WHERE post_id = ?`, [title,id]);

        await sqlConn.queryReturnWithParams(`
        UPDATE posts SET category_id = ? WHERE post_id = ?`, [category, id])

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.deletePost = async function deletePost(sqlConn,id){

    try{
        await sqlConn.queryReturnWithParams(`
        DELETE FROM posts WHERE post_id = ?`, [id]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllPosts = async function getAllPosts(sqlConn){

    try{
        let posts = await sqlConn.queryReturnNoParam(`
        SELECT article_title,content,date_created, post_id, category_name FROM posts
        LEFT JOIN categories
        ON categories.category_id = posts.category_id`);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getPostWithId = async function getPostWithId(sqlConn,id){

    try{
        let posts = await sqlConn.queryReturnWithParams(`
        SELECT article_title,content,date_created, post_id, category_name FROM posts
        LEFT JOIN categories
        ON categories.category_id = posts.category_id WHERE post_id=?`,[id]);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 