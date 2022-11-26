CREATE TABLE blocks(
        block_id VARCHAR(40),
        content TEXT,
        scripts TEXT,
        mode VARCHAR(4)
);

INSERT INTO blocks
VALUES ('hero', '<div class="col-8">
                 <div id="pageContent">
                   <div class="row">
                     <div class="col-3">
                       <form id="heroForm">
                         <div class="form-group">
                           <label for="pageHeading" class="col-form-label">Heading: </label>
                           <input type="text" class="form-control" id="pageHeading" oninput="updateText('mainHeading',document.getElementById('pageHeading').value);">
                           
                           <label for="pageHeadingColor" class="col-form-label">Font color:</label>
                           <input type="color" class="form-control" id="pageHeadingColor">
                           
                           <label for="pageSubHeading" class="col-form-label">Subheading: </label>
                           <input type="text" class="form-control" id="pageSubHeading" oninput="updateText('subHeading',document.getElementById('pageSubHeading').value);">
                       
                           <label for="ctaButtonText" class="col-form-label">Call to action text: </label>
                           <input type="text" class="form-control" id="ctaButtonText" oninput="updateText('callToAction',document.getElementById('ctaButtonText').value);">
                       
 
                           <label for="imageUpload" class="col-form-label">Background Image: </label>
                           <input type="file" id="imageUpload" accept="image/jpeg, image/png, image/jpg">
                         </div>
                       </form>
                     </div>
                     <div class="col-9" id="heroContent">
                       <div class="jumbotron" id="heroJumbotron">
                         <h1 id="mainHeading" class="display-4"></h1>
                         <p id="subHeading" class="lead"></p>
                         <hr class="my-4">
                         <a id="callToAction" class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
                       </div>
                     </div>
                   </div>
             </div>','<script>
   document.querySelector("#pageHeadingColor").addEventListener("change",function(){
     document.querySelector("#mainHeading").style.color = document.querySelector("#pageHeadingColor").value;
   })
 
   document.querySelector("#imageUpload").addEventListener("change",function(){
     const reader = new FileReader();
     reader.addEventListener("load", () => {
         const uploadedImage = reader.result;
         document.querySelector("#heroJumbotron").style.backgroundImage = `url(${uploadedImage})`;
     });
     reader.readAsDataURL(this.files[0]);
   });
 
   function updateText(target,textIn){
         document.getElementById(target).innerText = textIn
     }
     
     async function saveBlock(pageId,url,port){
     console.log(url);
     console.log(port);
     let content = document.querySelector(`#heroContent`).cloneNode(true);
 		const res = await fetch(`${url}:${ port }/api/nextBlockId`, {
                 method:'POST',
                 headers: {
                     "Content-Type": "application/json"
                 },
                 credentials: 'include',
                 body: JSON.stringify({page_id:pageId})
             });
       let result = await res.json();
       
        await fetch(`${url }:${ port }/api/addBlock`, {
                 method:'POST',
                 headers: {
                     "Content-Type": "application/json"
                 },
                 credentials: 'include',
                 body:JSON.stringify({block_id:result.block_id, page_id:pageId, content:content.innerHTML,order:result.order})
               });
               
               location.href = `/dashboard/editPage/1`;
     }
     
     function redirect(pageId){
     location.href = `/dashboard/editPage/${pageId}`;
     }
 
 
 </script>', 'add');