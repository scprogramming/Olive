const sqlHandle = require('../handlers/DbHandler.js');

module.exports.getAllCourses = async function getAllCourses(sqlConn){

    try{
        let courses = await sqlConn.queryReturnWithParams(`SELECT * FROM courses`);
        
        return [courses];
    }catch (err){
        console.error(err);
    }
    
} 