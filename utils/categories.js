module.exports.addCategory = async function addCategory(mongoConn,cat){

    try{

        const res = await mongoConn.singleInsert("Categories", {category_name:cat})

        return [true,res.insertedId.toString()];
        
    }catch (err){
        console.log(err);
        return [false,-1];
    }
    
} 

module.exports.editCategory = async function editCategory(mongoConn,id,cat){

    try{
        await mongoConn.singleUpdateWithId("Categories",id,{$set: {category_name:cat}})
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.deleteCategory = async function deleteCategory(mongoConn,id){

    try{
        await mongoConn.singleDeleteWithId('Categories',id);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllCategories = async function getAllCategories(mongoConn){

    try{
        let categories = await mongoConn.getAll("Categories");
        
        return categories;
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