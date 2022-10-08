const sqlHandle = require('../handlers/DbHandler.js');

module.exports.addPage = async function addPage(sqlConn,title,data,pagePath){

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
         
        let getNextIdContent = await sqlConn.queryReturnNoParam(`
        SELECT MAX(content_id) AS max_id FROM page_content`);

        let contentId = 0;

        if (getNextIdContent[0][0].max_id !== null){
            contentId = parseInt(getNextIdContent[0][0].max_id) + 1
        }
         

        await sqlConn.queryReturnWithParams(`INSERT INTO pages(page_id, page_title, content_id, date_created,page_path)
        VALUES (?,?,?,?,?)`,[targetId,title,contentId, yyyy + '-' + mm + '-' + dd,pagePath]);
        
        return [true,targetId,contentId];
    }catch (err){
        console.log(err);
        return [false];
    }
    
} 

module.exports.addBlock = async function addBlock(sqlConn,contentId,content,order){

    try{

        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(block_id) AS max_id FROM page_content`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }
         
        await sqlConn.queryReturnWithParams(`INSERT INTO page_content
        VALUES (?,?,?,?)`,[targetId,contentId,content,order]);
        
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

module.exports.getAllContent = async function getAllContent(sqlConn,contentId){

    try{
        let pages = await sqlConn.queryReturnWithParams(`
        SELECT * FROM page_content WHERE content_id=? ORDER BY content_order ASC;`,[contentId]);
        
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

module.exports.getPageWithPath = async function getPageWithPath(sqlConn,pagePath){

    try{
        let pages = await sqlConn.queryReturnWithParams(`
        SELECT * FROM pages WHERE page_path = ?`,[pagePath]);
        
        return pages;
    }catch (err){
        console.error(err);
    }
    
} 