const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addModule = async function addModule(sqlConn,courseId,moduleTitle){
    try{

        let getModuleId = await sqlConn.queryReturnWithParams(`
        SELECT MAX(module_id) AS max_id, course_id FROM course_module WHERE course_id = ? GROUP BY course_id`, [courseId]);

        let moduleId = 1;

        if (getModuleId[0].length != 0){
            moduleId = parseInt(getModuleId[0][0].max_id) + 1
        }

        let getLessonId = await sqlConn.queryReturnWithParams(`SELECT MAX(lesson_id) AS max_id, module_id FROM lessons WHERE module_id = ? GROUP BY module_id`, [moduleId]);
        let lessonId = 1;

        if (getLessonId[0].length != 0){
            lessonId = parseInt(getLessonId[0][0].max_id) + 1
        }

        await sqlConn.queryReturnWithParams(`INSERT INTO course_module
        VALUES (?,?,?,?)`, [moduleId, moduleTitle,lessonId, courseId]);

        await sqlConn.queryReturnWithParams(`INSERT INTO lessons VALUES(?,?,?)`,[lessonId,'Lesson 1', moduleId]);
        await sqlConn.queryReturnWithParams(`INSERT INTO lesson_blocks(lesson_block_id, lesson_id, content_order) VALUES(?,?,?)`, [1,lessonId,0]);

        return [true]
    }catch(err){
        console.error(err);
        return [false]
    }
}

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
        let courseData = [];
        let courses = await sqlConn.queryReturnWithParams(`SELECT * FROM courses WHERE course_id = ?`,[id]);
        let modules = await sqlConn.queryReturnWithParams(`SELECT * FROM course_module WHERE course_id = ?`, [id]);

        for (let i = 0; i < modules[0].length; i++){
            let moduleContent = {module_title: modules[0][i].module_title, lessons: []};

            let lessons = await sqlConn.queryReturnWithParams(`SELECT * FROM lessons WHERE lesson_id = ?`, modules[0][i].lesson_id);

            for (let j = 0; j < lessons[0].length; j++){
                
                let lesson_blocks = await sqlConn.queryReturnWithParams(`SELECT * FROM lesson_blocks WHERE lesson_id = ?`, lessons[0][j].lesson_id);
                let lessonContent = {lesson_id: lessons[0][j].lesson_id, lesson_title: lessons[0][j].lesson_title, lesson_content:[lesson_blocks[0]]};

                moduleContent.lessons = lessonContent;
            }
            courseData.push(moduleContent);
        }
        
        return [courses[0][0].course_title, courseData];
    }catch (err){
        console.error(err);
        return ["",""]
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