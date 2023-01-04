const sqlHandle = require('../handlers/DbHandler.js');
const mongodb = require('mongodb');

module.exports.addModule = async function addModule(mongoConn,courseId,moduleTitle){
    try{

        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.lessons.push({lesson_title:moduleTitle, content:[{content:""}]});
        await mongoConn.singleUpdateWithId("Courses",courseId,{$set: {lessons:course.lessons}});
        
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

module.exports.getAllContent = async function getAllContent(mongoConn,id){

    try{
        let courses = await mongoConn.singleFind('Courses', {_id: mongodb.ObjectId(id)});
        
        return courses;
    }catch (err){
        console.error(err);
        return ["",""]
    }
    
}


module.exports.checkPath = async function checkPath(mongoConn, course_path){
    try{
        let res = await mongoConn.singleFind("Courses", {course_path:course_path});

        if (res !== null){
            return -1
        }else{
            return 1;
        }
    }catch (err){
        console.error(err);
    }
}

module.exports.addCourse = async function addCourse(mongoConn,title,coursePath){
    try{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let res = await mongoConn.singleInsert("Courses",{course_title:title, date_created: yyyy + '-' + mm + '-' + dd, course_path:coursePath, lessons: [{lesson_title:"Lesson1", content: [{content:""}]}]});
        
        return [true,res.insertedId.toString()];
    }catch (err){
        console.log(err);
        return [false];
    }
    
} 