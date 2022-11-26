## API

This file contains all of the code for the API server of the program. 

## Constructor

**Parameters**

* conf: A configuration object specifying all configuration options for the application

The constructor of the API server creates an instance of `express()`, enabled the `express.json` middleware. A limit is set on the possible size of an express request and it is completly customizable through the configuration of the application.

The API uses a CORS policy, specifying an origin of either the host on port 5000, or the host on port 80. The credentials option is set to `true` to allow for proper handling of authentication sessions.

This application uses the `ejs` view engine to pass data between the backend and frontend. This is set inside of the constructor using the `set` method. The application also uses a set of public CSS and js files, which is set using the `use` method to the `/public` directory.

## /api/addCategory

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* category_name: The name of the category being added to the database

**Returns**

* {code: 1, status: "Saved!", id:result[1]} if the request is successful. The id returned in the JSON is the ID of the new category
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/categories.ejs`

## /api/addPost

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* title: The title to use for the post
* data: The data contained within the post
* categoryId: An ID representing the category of the post

**Returns**

* {code: 1, status: "Saved!"} if the request is successful
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/addPost.ejs`

## /api/addBlock

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* block_id: The ID of the block being added
* page_id: The page ID that is getting the new block
* content: The data contained in the block
* order: The order of the block on the page

**Returns**

* {code: 1, status: "Saved!"} if the request is successful
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/addBlock.ejs`. Note that the script that uses this API call is dynamically built from the database rather than hardcoded in the file.

## /api/nextBlockId

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* page_id: The page ID that is getting the new block

**Returns**

* {code: 1, status: "Saved!", block_id: result[1], order:result[2]} if the request is successful. The block_id value is the ID for the new block, and the order value is the order location of the new block
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/addBlock.ejs`. Note that the script that uses this API call is dynamically built from the database rather than hardcoded in the file.

## /api/editBlock

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* blockId: The ID of the block being edited
* page_id: The page ID that is getting the new block
* content: The new content for the block being edited

**Returns**

* {code: 1, status: "Saved!", block_id: result[1]} if the request is successful. The block_id value is the ID for the edited block
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/editBlock.ejs`. Note that the script that uses this API call is dynamically built from the database rather than hardcoded in the file.
