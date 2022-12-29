const sqlHandle = require('../handlers/DbHandler.js');

module.exports.getAllCourses = async function getAllCourses(sqlConn){

    try{
        let courses = await sqlConn.queryReturnWithParams(`SELECT * FROM courses`);
        
        return [courses];
    }catch (err){
        console.error(err);
    }
    
}

module.exports.getAllContent = async function getAllContent(sqlConn,id){

    try{
        let courses = await sqlConn.queryReturnWithParams(`SELECT * FROM courses WHERE course_id = ?`,[id]);
        
        return [courses];
    }catch (err){
        console.error(err);
    }
    
}


module.exports.checkPath = async function checkPath(sqlConn, course_path){
    try{
        let pathCount = await sqlConn.queryReturnWithParams(`
        SELECT COUNT(course_path) AS page_count FROM courses WHERE course_path = ?`, [course_path]);

        if (pathCount[0][0].page_count != 0){
            return -1
        }else{
            return 1;
        }
    }catch (err){
        console.error(err);
    }
}

module.exports.addCourse = async function addCourse(sqlConn,title,coursePath){
    try{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(course_id) AS max_id FROM courses`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }
         

        await sqlConn.queryReturnWithParams(`INSERT INTO courses(course_id, course_title, date_created,course_path)
        VALUES (?,?,?,?)`,[targetId,title, yyyy + '-' + mm + '-' + dd,coursePath]);
        
        return [true,targetId];
    }catch (err){
        console.log(err);
        return [false];
    }
    
} 