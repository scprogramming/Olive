const sqlHandle = require('../handlers/DbHandler.js');

module.exports.processPost = async function processPost(sqlConn,title,data){

    try{
        let checkCount = await sqlConn.queryReturnWithParams(`
        SELECT COUNT(*) AS title_count FROM posts WHERE article_title=?
        `,title);
    
        console.log(checkCount[0][0].title_count);
    
        if (checkCount[0][0].title_count == 0){
            await sqlConn.queryReturnWithParams(`INSERT INTO posts
            VALUES (?,?)`,[title,data]);
        }else{
            await sqlConn.queryReturnWithParams(`UPDATE posts
            SET content = ? WHERE article_title = ?`,[data,title]);
        }
        
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 