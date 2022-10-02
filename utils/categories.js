const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addCategory = async function addCategory(sqlConn,cat){

    try{

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(category_id) AS max_id FROM categories`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }
         

        await sqlConn.queryReturnWithParams(`INSERT INTO categories(category_id, category_name)
        VALUES (?,?)`,[targetId,cat]);
        
        return [true,targetId];
    }catch (err){
        console.log(err);
        return [false,-1];
    }
    
} 

module.exports.editCategory = async function editCategory(sqlConn,id,cat){

    try{
        await sqlConn.queryReturnWithParams(`
        UPDATE categories SET category_name = ? WHERE category_id = ?`,[cat,id]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.deleteCategory = async function deleteCategory(sqlConn,id){

    try{
        await sqlConn.queryReturnWithParams(`
        DELETE FROM categories WHERE category_id = ?`, [id]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllCategories = async function getAllCategories(sqlConn){

    try{
        let posts = await sqlConn.queryReturnNoParam(`
        SELECT * FROM categories`);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getCategoryWithId = async function getCategoryWithId(sqlConn,id){

    try{
        let posts = await sqlConn.queryReturnWithParams(`
        SELECT * FROM categories WHERE category_id=?`,[id]);
        
        return posts;
    }catch (err){
        console.error(err);
    }
    
} 