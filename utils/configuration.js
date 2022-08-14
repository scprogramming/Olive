
module.exports.Configuration = class Configuration{

    constructor(host,port,user,pass,database,serverAddress,serverPort){
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.database = database;
        this.serverAddress = serverAddress;
        this.serverPort = serverPort;
    }
}