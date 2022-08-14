
module.exports.Configuration = class Configuration{

    constructor(env){
        this.host = env.databaseAddress;
        this.port = env.databasePort;
        this.user = env.databaseUser;
        this.pass = env.databasePassword;
        this.database = env.database;
        this.serverAddress = env.serverAddress;
        this.serverPort = env.serverPort;
        this.registrationEnabled = env.registrationEnabled;
    }
}