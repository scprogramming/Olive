const mongodb = require('mongodb');

module.exports.addPost = async function addPost(mongoConn,title,data,category){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        await mongoConn.singleInsert("Posts",{article_title:title, content:data, date_created:yyyy + '-' + mm + '-' + dd, category:category});

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

module.exports.deletePost = async function deletePost(mongoConn,id){

    try{
        await mongoConn.singleDeleteWithId("Posts",id);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllPosts = async function getAllPosts(mongoConn){

    try{
        let posts = await mongoConn.getAll("Posts")
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getPostWithId = async function getPostWithId(mongoConn,id){

    try{

        let posts = await mongoConn.singleFind("Posts", {_id: mongodb.ObjectId(id)});
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 