const e = require('cors');
const mongo = require('mongodb');

module.exports.MongoDbHandler = class MongoDbHandler{
    constructor(host, port, user, password, database){
        this.db = database;
        const uri = `mongodb://${host}:${port}/`;
        this.client = new mongo.MongoClient(uri);
    }

    async singleInsert(collection,fields){
        await this.client.connect();
        const database = this.client.db(this.db);
        const coll = database.collection(collection);

        return coll.insertOne(fields);
    } 

    async singleFind(collection, fields){
        await this.client.connect();
        const database = this.client.db(this.db);
        const coll = database.collection(collection);

        return coll.findOne(fields);
    }

    async singleUpdateWithId(collection,id,updates){
        await this.client.connect();
        const database = this.client.db(this.db);
        const coll = database.collection(collection);

        const o_id = new mongo.ObjectId(id);
        coll.updateOne({_id:o_id},updates);
    }

    async singleDeleteWithId(collection,id){
        await this.client.connect();
        const database = this.client.db(this.db);
        const coll = database.collection(collection);

        const o_id = new mongo.ObjectId(id);
        coll.deleteOne({_id:o_id});
    }
}