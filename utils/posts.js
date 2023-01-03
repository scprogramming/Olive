const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addPost = async function addPost(mongoConn,title,data,categoryId){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        await mongoConn.singleInsert("Posts",{article_title:title, content:data, date_created:yyyy + '-' + mm + '-' + dd, category_id:categoryId});

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.editPost = async function editPost(mongoConn,title,data,id, category){

    try{
        await mongoConn.singleUpdateWithId("Posts",id,{$set: {content:data,article_title:title, category_id:category}});
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