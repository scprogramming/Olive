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

module.exports.updateLessonTitle = async function updateLessonTitle(mongoConn,courseId, moduleId,title, lessonId){
    try{
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].lessons[lessonId].lesson_title = title;
        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {modules:course.modules}});

        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deleteModule = async function deleteModule(mongoConn,courseId,moduleId){
    try{
        let courses = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        courses.modules.splice(moduleId,1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {modules:courses.modules}});

        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deleteLesson = async function deleteLesson(mongoConn,courseId,moduleId, lessonId){
    try{
        let course  = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].lessons.splice(lessonId, 1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {modules:course.modules}});
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deletePaymentPlan = async function deletePaymentPlan(mongoConn,courseId, paymentId){
    try{
        let course  = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.payment_options.splice(paymentId, 1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {payment_options:course.payment_options}});
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.updateLearningObj = async function updateLearningObj(mongoConn,courseId,title,id){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.learning_objectives[id] = title;

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {learning_objectives:course.learning_objectives}})
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.updateAudience = async function updateAudience(mongoConn,courseId,title,id){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.audience[id] = title;

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {audience:course.audience}})
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.updateRequirements = async function updateRequirements(mongoConn,courseId,title,id){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.requirements[id] = title;

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {requirements:course.requirements}})
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}


module.exports.deleteAudience = async function deleteAudience(mongoConn,courseId, audienceId){
    try{
        let course  = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.audience.splice(audienceId, 1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {audience:course.audience}});
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deleteLearningObjecive = async function deleteLearningObjecive(mongoConn,courseId, learningObj){
    try{
        let course  = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.learning_objectives.splice(learningObj, 1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {learning_objectives:course.learning_objectives}});
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deleteRequirements = async function deleteRequirements(mongoConn,courseId, reqId){
    try{
        let course  = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.requirements.splice(reqId, 1);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {requirements:course.requirements}});
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

module.exports.deleteCourse = async function deleteCourse(mongoConn,courseId){
    try{
        await mongoConn.singleDeleteWithId("Courses",courseId);
        return true;
    }catch(err){
        console.error(err);
        return false;
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

module.exports.updateModuleTitle = async function updateModuleTitle(mongoConn,courseId,moduleId, title){
    try{
        let course = await mongoConn.singleFind("Courses", {_id: mongodb.ObjectId(courseId)});
        course.modules[moduleId].module_title = title;
        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {modules:course.modules}});

        return true;
    }catch (err){
        console.error(err);
        return false;
    }
}

module.exports.saveVideo = async function saveVideo(mongoConn,video,lessonId, moduleId, courseId){
    try{
        const videoPath = 'assets/videos/' + video[0].filename;
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

module.exports.addLearningObjective = async function addLearningObjective(mongoConn,courseId,learningObj){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.learning_objectives.push(learningObj);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {learning_objectives:course.learning_objectives}})
        return true;
    }catch(err){
        console.error(err);
    }
}

module.exports.addRequirement = async function addRequirement(mongoConn,courseId,requirement){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.requirements.push(requirement);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {requirements:course.requirements}})
        return true;
    }catch(err){
        console.error(err);
    }
}

module.exports.addAudience = async function addAudience(mongoConn,courseId,newAudience){
    try{
        let course = await mongoConn.singleFind("Courses", {_id:mongodb.ObjectId(courseId)});
        course.audience.push(newAudience);

        await mongoConn.singleUpdateWithId("Courses", courseId, {$set: {audience:course.audience}})
        return true;
    }catch(err){
        console.error(err);
    }
}

module.exports.addCourse = async function addCourse(mongoConn,title,coursePath,thumbnail,courseDesc){
    try{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let res = await mongoConn.singleInsert("Courses",{course_title:title, 
            courseDesc:courseDesc, 
            thumbnail:thumbnail, 
            payment_options:[], 
            date_created: yyyy + '-' + mm + '-' + dd, 
            learning_objectives:[],
            audience:[],
            requirements:[],
            course_path:coursePath, 
            modules: [{module_title:"Module1", 
            lessons: [{lesson_title:"Lesson1", content: {data:"",type:""} } ] } ]}
        );
        
        return [true,res.insertedId.toString()];
    }catch (err){
        console.error(err);
        return [false];
    }
    
} 