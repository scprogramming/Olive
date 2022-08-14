
module.exports.Configuration = class Configuration{

    constructor(host,port,user,pass,database){
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.database = database;
    }
}