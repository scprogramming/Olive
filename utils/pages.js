const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addPage = async function addPage(sqlConn,title,data,categoryId){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(page_id) AS max_id FROM pages`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }
         

        await sqlConn.queryReturnWithParams(`INSERT INTO pages(page_id, page_title, content, date_created)
        VALUES (?,?,?,?)`,[targetId,title,data, yyyy + '-' + mm + '-' + dd]);
        
        return [true,targetId];
    }catch (err){
        console.log(err);
        return [false];
    }
    
} 

module.exports.editPage = async function editPage(sqlConn,title,data,id, category){

    try{
        await sqlConn.queryReturnWithParams(`
        UPDATE pages SET content = ? WHERE page_id = ?`,[data,id]);
        await sqlConn.queryReturnWithParams(`
        UPDATE pages SET page_title = ? WHERE page_id = ?`, [title,id]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.deletePage = async function deletePage(sqlConn,id){

    try{
        await sqlConn.queryReturnWithParams(`
        DELETE FROM pages WHERE page_id = ?`, [id]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.getAllPages = async function getAllPages(sqlConn){

    try{
        let pages = await sqlConn.queryReturnNoParam(`
        SELECT * FROM pages;`);
        
        return pages;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getPageWithId = async function getPageWithId(sqlConn,id){

    try{
        let pages = await sqlConn.queryReturnWithParams(`
        SELECT * FROM pages WHERE page_id = ?`,[id]);
        
        return pages;
    }catch (err){
        console.error(err);
    }
    
} 