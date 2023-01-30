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
        console.error(err);
        return [false];
    }
    
} 

module.exports.addBlock = async function addBlock(mongoConn,pageId,content,order){

    try{
         
        const res = await mongoConn.singleFind('Pages',{_id:new mongodb.ObjectId(pageId)});
        res.page_content.push({content:content})

        await mongoConn.singleUpdateWithId('Pages',pageId,{$set: {page_content:res.page_content}});
        
        return true;
    }catch (err){
        console.error(err);
        return false;
    }
    
} 


module.exports.editPageTitle = async function editPageTitle(mongoConn,id,title){

    try{
        await mongoConn.singleUpdateWithId("Pages", id, {$set: {page_title:title}});

        return true;
    }catch (err){
        console.error(err);
        return false;
    }
    
} 

module.exports.nextBlockId = async function nextBlockId(mongoConn, page_id){
    try{

        let res = await mongoConn.singleFind("Pages",{_id:new mongodb.ObjectId(page_id)})
        let len = res.page_content.length;
         
        return [true,len,len];
    }catch (err){
        console.error(err);
        return [false,-1,-1];
    }
}

module.exports.deleteBlock = async function deleteBlock(mongoConn, blockId, pageId){
    try{
        let res = await mongoConn.singleFind("Pages",{_id:new mongodb.ObjectId(pageId)});
        res.page_content.splice(blockId,1);
        await mongoConn.singleUpdateWithId("Pages",pageId,{$set: {page_content:res.page_content}});

        return true;
    }catch (err){
        console.error(err);
        return false;
    }
}

module.exports.getBlockContent = async function getBlockContent(mongoConn, pageId, blockId){
    try{
        let res = await mongoConn.singleFind('Pages',{_id: mongodb.ObjectId(pageId)});

        return res.page_content[blockId];
    }catch(err){
        console.error(err);
        return "";
    }
}

module.exports.getBlock = async function getBlock(mongoConn, blockType,blockMode){
    try{

        let res = await mongoConn.singleFind("Blocks", {block_type:blockType,mode:blockMode});

        return [res.content, res.scripts];
    }catch(err){
        console.error(err);
        return "";
    }
}

module.exports.editBlock = async function editBlock(mongoConn,blockId,content,pageId){

    try{
        let res = await mongoConn.singleFind("Pages",{_id:mongodb.ObjectId(pageId)});
        const resContent = res.page_content;
        resContent[blockId] = {content:content};

        await mongoConn.singleUpdateWithId("Pages",pageId,{$set: {page_content:resContent}});

        return [true, blockId];
    }catch (err){
        console.error(err);
        return [false,-1];
    }
    
} 

module.exports.deletePage = async function deletePage(mongoConn,id){

    try{
        await mongoConn.singleDeleteWithId("Pages",id);

        return true;
    }catch (err){
        console.error(err);
        return false;
    }
    
} 

module.exports.getAllPages = async function getAllPages(mongoConn){

    try{
        let pages = await mongoConn.getAll("Pages");
        
        return pages;
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.getAllContent = async function getAllContent(mongoConn,pageId){

    try{
        let pages = await mongoConn.singleFind("Pages",{_id:mongodb.ObjectId(pageId)})
        
        return [pages.page_content,pages.page_title];
    }catch (err){
        console.error(err);
    }
    
} 

module.exports.updateOrder = async function updateOrder(mongoConn,blockId1, blockId2, pageId){

    try{

        let res = await mongoConn.singleFind("Pages",{_id:new mongodb.ObjectId(pageId)})
        let currentList = res.page_content;

        let tmp = currentList[blockId2];
        currentList[blockId2] = currentList[blockId1];
        currentList[blockId1] = tmp;

        await mongoConn.singleUpdateWithId("Pages",pageId,{$set: {page_content:currentList}});

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

module.exports.getPageWithPath = async function getPageWithPath(mongoConn,pagePath){

    try{

        let res = await mongoConn.singleFind("Pages",{page_path:pagePath});
        
        return res.page_content;
    }catch (err){
        console.error(err);
    }
    
} 