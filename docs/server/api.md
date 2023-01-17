## api.js

This file contains all of the code for the API server of the program. 

## Constructor

**Parameters**

* conf: A configuration object specifying all configuration options for the application

The constructor of the API server creates an instance of `express()`, enabled the `express.json` middleware. A limit is set on the possible size of an express request and it is completly customizable through the `postLimit` configuration option.

The API uses a CORS policy, specifying an origin of either the host on port 5000, or the host on port 80. The credentials option is set to `true` to allow for proper handling of authentication sessions.

This application uses the `ejs` view engine to pass data between the backend and frontend. This is set inside of the constructor using the `set` method. The application also uses a set of public CSS and js files, which is set using the `use` method to the `/public` directory.

The API uses `multer` in order to handle video uploads for courses. `multer` is configured to store uploaded videos the the `server/public/uploads` path, saving them with their file name datestamped to ensure a unique name for each file. 

A limit on the file size is set through `multer` and it is customizable through the `videoSizeLimit` configuration parameter. 

## /api/addModule

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* courseId: The ID of the course the module is being added to
* moduleTitle: The title of the module being added to the course

**Returns**

* {code: 1, status: "Saved!", id:result[1]} if the request is successful. The id returned in the JSON is the index of the newly added module in the courses module list
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/course/editCourse.ejs`

## /api/addPaymentOption

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* courseId: The ID of the course the payment option is being added to
* planName: The name of the payment plan being added to the course
* planType: The type of payment plan, either free, one-time payment, or subscription
* currency: The currency to use for the course payment
* payAmount: The amount of money the payment option costs
* frequency: Used fo subscription payments to determine how often a payment occurs

**Returns**

* {code: 1, status: "Saved!"} if the request is successful.
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/course/editCourse.ejs`

## /api/uploadLessonRichText

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* courseId: The ID of the course the rich text lesson is being added to
* data: The rich text data being added to the lesson
* moduleId: The ID of the module that the lesson exists in
* lessonId: The ID of the lesson that the rich text is being added to

**Returns**

* {code: 1, status: "Saved!"} if the request is successful.
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/course/editCourse.ejs`

## /api/uploadVideo

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

The data for this API request is sent as a multipart form, using multer for parsing.

* courseId: The ID of the course the video lesson is being added to
* files: The video being uploaded to the course
* moduleId: The ID of the module that the lesson exists in
* lessonId: The ID of the lesson that the video is being added to

**Returns**

* {code: 1, status: "Saved!", video:result[1]} if the request is successful. The video value returned is a URL pointing to the location of the uploaded video
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/course/editCourse.ejs`

## /api/addLesson

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* courseId: The ID of the course the lesson is being added to
* lessonTitle: The title of the lesson being added to the course
* moduleId: The ID of the module the lesson is being added to

**Returns**

* {code: 1, status: "Saved!", id:result[1]} if the request is successful. The id returned in the JSON is the index of the newly added lesson in the module lesson list
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/course/editCourse.ejs`

## /api/addPost

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* title: The title to use for the course
* course_path: The path of the course on the website

**Returns**

* {code: 1, status: "Saved!", course_id:result[1]} if the request is successful. The course_id returned is the ObjectId of the course created in MongoDB
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**
`views/pages/dashboard/post/addPost.ejs`

## /api/deleteBlock

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* block_id: The ID of the block that should be deleted
* page_id: The ID of the page containing the block to be deleted 

**Returns**

* {code: 1, status: "Deleted!"} if the request is successful.
* {code: -1, status: "Failed to delete"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**
`views/pages/dashboard/page/editPage.ejs`

## /api/deletePost/:id

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* id: The ID of the post that should be deleted

**Returns**

* {code: 1, status: "Deleted!"} if the request is successful.
* {code: -1, status: "Failed to delete"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**
`views/pages/dashboard/post/posts.ejs`

## /api/deleteCategory/:id

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* id: The ID of the category that should be deleted

**Returns**

* {code: 1, status: "Deleted!"} if the request is successful.
* {code: -1, status: "Failed to delete"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**
`views/pages/dashboard/categories.ejs`

## /api/deletePage/:id

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* id: The ID of the page that should be deleted

**Returns**

* {code: 1, status: "Deleted!"} if the request is successful.
* {code: -1, status: "Failed to delete"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**
`views/pages/dashboard/page/pages.ejs`

## /api/updatePageOrder

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* block_id1: The first block to be swapped in order
* block_id2: The second block to be swapped in order
* page_id: The page that has the blocks that need to be swapped

**Returns**

* {code: 1, status: "Saved!"} if the request is successful
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/page/editPage.ejs`

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

## /api/editCategory

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* category_name: The name of the category being added to the database
* category_id: The ID of the category being updated

**Returns**

* {code: 1, status: "Saved!", id:category_id} if the request is successful. The id returned in the JSON is the ID of the updated category
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

`views/pages/dashboard/post/addPost.ejs`

## /api/editPost

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* title: The title to use for the post
* data: The data contained within the post
* id: The ID of the page being updated
* categoryId: An ID representing the category of the post

**Returns**

* {code: 1, status: "Saved!"} if the request is successful
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/post/editPost.ejs`

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

## /api/addPage

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* title: The title of the page you are adding
* page_path: The path to the page you are creating

**Returns**

* {code: 1, status: "Saved!", page_id:result[1]} if the request is successful. The page_id returned is the ObjectId of the page created in MongoDB
* {code: -1, status: "Failed to save, title cannot be empty"} if an empty title is received
* {code: -1, status: "Failed to save, path cannot be blank"} if the provided page_path is blank
* {code: -1, status: "Failed to save, page path already exists, select a unique path"} if the provided page_path already exists
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/page/addPage.ejs`

## /api/editPageTitle

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* page_id: The page ID that is getting the updated title
* title: The updated title for the page

**Returns**

* {code: 1, status: "Saved!"} if the request is successful.
* {code: -1, status: "Failed to save"} if the request failed
* {code: -1, status: "Requires authorization"} if authentication fails

**Used By**

`views/pages/dashboard/page/editPage.ejs`

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

## /api/registration

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* email: The email of the user being registered
* user_password: The password of the user being registered
* confirm_password: The password of the user being registered, used to confirm the password was entered correctly
* first_name: The first name of the user being registered
* last_name: The last name of the user being registered

**Returns**

* {code: 1, status: "Saved!"} if the request is successful. 
* {code: -2, status: "User already exists, pick another email!"} if the email provided exists already
* {code: -3, status: "Passwords provided do not match!"} if the user_password and confirm_password fields do not match
* {code: -1, status: "Failed to register user"} if the request failed
* {code: -1, status: "Registration is not a valid endpoint"} if registration is disabled
* {code: -1, status: "Registration is not a valid endpoint"} if registration is disabled

**Used By**

`views/pages/register.ejs`

## /api/login

**Valid methods**

* POST

**Requires authentication** 

Yes

**Expected data**

* email: The email of the user
* user_password: The password of the user
**Returns**

* {code: 1, status: "Login Successful!"} if valid credentials are received
* {code: -1, status: "Invalid username or password"} if the login is invalid
* {code: -1, status: "Failed to login!"} if the request fails

**Used By**

`views/pages/login.ejs`