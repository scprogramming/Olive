const mongodb = require('mongodb');

module.exports.savePaymentPlan = async function savePaymentPlan(mongoConn,courseId, planName, planType, currency, payAmount, frequency){
    try{
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.payment_options.push({plan_name:planName, plan_type:planType, currency:currency, pay_amount:payAmount, frequency:frequency, status:'enabled'});
        await mongoConn.singleUpdateWithId("Courses",courseId, {$set: {payment_options:course.payment_options}});

        return [true,1];
    }catch(err){
        console.error(err);
        return [false, -1];
    }
}

module.exports.addModule = async function addModule(mongoConn,courseId,moduleTitle){
    try{

        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules.push({module_title:moduleTitle, lessons:[{lesson_title:"Lesson1",content: {data:"",type:""}}]});
        await mongoConn.singleUpdateWithId("Courses",courseId,{$set: {modules:course.modules}});
        
        return [true,course.modules.length - 1]
    }catch(err){
        console.error(err);
        return [false,-1]
    }
}

module.exports.saveRichText = async function saveRichText(mongoConn,data, courseId, moduleId, lessonId){
    try {
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].lessons[lessonId].content.data = data;
        course.modules[moduleId].lessons[lessonId].content.type = "richText";

        await mongoConn.singleUpdateWithId("Courses", courseId,{$set: {modules:course.modules}});
        return [true];
    }catch(err){
        console.error(err);
        return[false,-1];
    }
    
}

module.exports.saveVideo = async function saveVideo(mongoConn,video,lessonId, moduleId, courseId){
    try{
        const videoPath = '/public/uploads/' + video[0].filename;
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].lessons[lessonId].content.data = videoPath;
        course.modules[moduleId].lessons[lessonId].content.type = "serverVideo";

        await mongoConn.singleUpdateWithId("Courses",courseId,{$set: {modules:course.modules}})
        return [true,videoPath];
    }catch(err){
        console.error(err);
        return [false,-1]
    }
}

module.exports.addLesson = async function addLesson(mongoConn,courseId,lessonTitle,moduleId){
    try{
        
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].lessons.push({lesson_title:lessonTitle,content: {data:"",type:""}});
        await mongoConn.singleUpdateWithId("Courses",courseId,{$set: {modules:course.modules}});
        
        return [true,course.modules[moduleId].lessons.length - 1]
    }catch(err){
        console.error(err);
        return [false,-1]
    }
}

module.exports.getAllCourses = async function getAllCourses(mongoConn){

    try{
        let courses = await mongoConn.getAll("Courses");
        
        return courses;
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

module.exports.getContentWithPath = async function getContentWithPath(mongoConn,path){

    try{
        let courses = await mongoConn.singleFind('Courses', {course_path:path});
        
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

module.exports.addCourse = async function addCourse(mongoConn,title,coursePath,thumbnail,courseDesc){
    try{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let res = await mongoConn.singleInsert("Courses",{course_title:title, courseDesc:courseDesc, thumbnail:thumbnail, payment_options:[], date_created: yyyy + '-' + mm + '-' + dd, course_path:coursePath, 
        modules: [{module_title:"Module1", lessons: [{lesson_title:"Lesson1", content: {data:"",type:""} } ] } ]}
        );
        
        return [true,res.insertedId.toString()];
    }catch (err){
        console.error(err);
        return [false];
    }
    
} 