## DbHandler.js

The DbHandler file contains all of the code used to interact with the MongoDB database.

### Constructor

**Parameters**

* host: The address of the MongoDB database server
* port: The port of the MongoDB database server
* user: The username of the user connecting to the MongoDB database server
* password: The password of the user connecting to the MongoDB database server
* database: The database name you are connecting to

The constructor constructs a URI to connect to the target host and port provided. The constructor will then create a client using the constructed URI

### singleInsert

**Parameters**

* collection: The name of a collection in the MongoDB database
* fields: The fields for the record you are inserting to the database

This method first creates a connection to the MongoDB server. It then loads the target collection and sends an `insertOne` query to MongoDB with the provided fields. The result is a new record inserted into the target collection. 

### singleFind

**Parameters** 

* collection: The name of a collection in the MongoDB database
* fields: The fields you are filtering for in the target collection

This method first creates a connection to the MongoDB server. It then loads the target collection, and sends a `findOne` query to MongoDB with the provided fields. The result is a single record from the collection matching the provided fields. 

### singleUpdateWithId

* collection: The name of a collection in the MongoDB database
* id: The ObjectId of the record you are updating
* updates: The updates you want to apply to the record, using the {$set: {fields}} structure

This method first creates a connection to the MongoDB server. It then loads the target collection, and sends a `updateOne` query to MongoDB with the provided fields, and the id parameter formatted as an ObjectId. The result is a single record from the collection being updated with the provided update data.

### singleDeleteWithId

* collection: The name of a collection in the MongoDB database
* id: The ObjectId of the record you are updating

This method first creates a connection to the MongoDB server. It then loads the target collection, and sends a `deleteOne` query to MongoDB, using the id parameter formatted as an ObjectId. The result is a single record from the collection being deleted.

### getAll

* collection: The name of a collection in the MongoDB database

This method first creates a connection to the MongoDB server. It then retrieves all data from the provided collection using the `find` method. The data is returned as an array.