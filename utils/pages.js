const sqlHandle = require('../handlers/DbHandler.js');
const mongodb = require('mongodb');

module.exports.addPage = async function addPage(mongoConn,title,pagePath){

    try{

        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth() + 1).padStart(2,'0');
        var yyyy = today.getFullYear();

        const res = await mongoConn.singleInsert("Pages",{page_title:title, date_created:yyyy + '-' + mm + '-' + dd, page_path: pagePath,
            page_content:[]});

        return [true,res.insertedId.toString()];
    }catch (err){
        console.log(err);
        return [false];
    }
    
} 

module.exports.addBlock = async function addBlock(mongoConn,pageId,content,order){

    try{
         
        const res = await mongoConn.singleFind('Pages',{_id:new mongodb.ObjectId(pageId)});
        res.page_content.push({_id: new mongodb.ObjectId(), content:content,content_order:order})

        await mongoConn.singleUpdateWithId('Pages',pageId,{$set: {page_content:res.page_content}});

        console.log(res.page_content);
        
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 


module.exports.editPageTitle = async function editPageTitle(mongoConn,id,title){

    try{
        await mongoConn.singleUpdateWithId("Pages", id, {$set: {page_title:title}});

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
    
} 

module.exports.nextBlockId = async function nextBlockId(sqlConn, page_id){
    try{
        let getNextId = await sqlConn.queryReturnNoParam(`
        SELECT MAX(block_id) AS max_id FROM page_content`);

        let targetId = 0;

        if (getNextId[0][0].max_id !== null){
            targetId = parseInt(getNextId[0][0].max_id) + 1
        }

        let getOrder = await sqlConn.queryReturnWithParams(`
        SELECT MAX(content_order) AS maxOrder FROM page_content WHERE page_id = ?`,[page_id]);

        let targetOrder = 0;

        if (getOrder[0][0].maxOrder !== null){
            targetOrder = parseInt(getOrder[0][0].maxOrder) + 1
        }
         
        return [true,targetId,targetOrder];
    }catch (err){
        console.log(err);
        return [false,-1,-1];
    }
}

module.exports.deleteBlock = async function deleteBlock(sqlConn, blockId, pageId){
    try{
        await sqlConn.queryReturnWithParams(`DELETE FROM page_content WHERE block_id = ? AND page_id = ?`, [blockId, pageId]);

        return true;
    }catch (err){
        console.log(err);
        return false;
    }
}

module.exports.getBlockContent = async function getBlockContent(sqlConn, pageId, blockId){
    try{
        let res = await sqlConn.queryReturnWithParams('SELECT content FROM page_content WHERE page_id = ? AND block_id = ?', [pageId, blockId]);

        return res[0][0].content;
    }catch(err){
        console.log(err);
        return "";
    }
}

module.exports.getBlock = async function getBlock(sqlConn, blockType,blockMode){
    try{
        let res = await sqlConn.queryReturnWithParams(`SELECT content,scripts FROM blocks WHERE block_type=? AND mode = ?`,[blockType,blockMode]);

        return [res[0][0].content, res[0][0].scripts];
    }catch(err){
        console.log(err);
        return "";
    }
}

module.exports.editBlock = async function editBlock(sqlConn,blockId,content,pageId){

    try{
        await sqlConn.queryReturnWithParams(`
        UPDATE page_content SET content = ? WHERE block_id = ? AND page_id = ?`,[content,blockId,pageId]);

        return [true, blockId];
    }catch (err){
        console.log(err);
        return [false,-1];
    }
    
} 

module.exports.deletePage = async function deletePage(sqlConn,id){

    try{
        await sqlConn.queryReturnWithParams(`
        DELETE FROM pages WHERE page_id = ?`, [id]);

        await sqlConn.queryReturnWithParams(`
        DELETE FROM page_content WHERE page_id = ?`,[id]);

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

module.exports.getAllContent = async function getAllContent(sqlConn,pageId){

    try{
        let pages = await sqlConn.queryReturnWithParams(`
        SELECT * FROM page_content WHERE page_id=? ORDER BY content_order ASC;`,[pageId]);
        let title = await sqlConn.queryReturnWithParams(`
        SELECT page_title FROM pages WHERE page_id=?`, [pageId]);
        
        return [pages,title];
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.updateOrder = async function updateOrder(sqlConn,blockId1, blockId2, pageId){

    try{
        let currentOrderRes1 = await sqlConn.queryReturnWithParams(`
        SELECT content_order FROM page_content WHERE page_id=? AND block_id = ? ORDER BY content_order ASC;`,[pageId, blockId1]);

        let currentOrderRes2 = await sqlConn.queryReturnWithParams(`
        SELECT content_order FROM page_content WHERE page_id=? AND block_id = ? ORDER BY content_order ASC;`,[pageId, blockId2]);

        const currentOrder1 = currentOrderRes1[0][0].content_order;
        const currentOrder2 = currentOrderRes2[0][0].content_order;

        await sqlConn.queryReturnWithParams(`
        UPDATE page_content SET content_order = ? WHERE page_id = ? AND block_id = ?`, [currentOrder2, pageId, blockId1]);

        await sqlConn.queryReturnWithParams(`
        UPDATE page_content SET content_order = ? WHERE page_id = ? AND block_id = ?`, [currentOrder1, pageId, blockId2]);
        
        return true;
    }catch (err){
        console.error(err);
        return false;
    }
    
} 

module.exports.checkPath = async function checkPath(mongoConn, page_path){
    try{

        let res = await mongoConn.singleFind("Pages", {page_path:page_path});

        if (res !== null){
            return -1
        }else{
            return 1;
        }
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

        let content = await sqlConn.queryReturnWithParams(`
        SELECT * FROM page_content WHERE page_id = ? ORDER BY content_order ASC`, [pages[0][0].page_id])
        
        return content;
    }catch (err){
        console.error(err);
    }
    
} 