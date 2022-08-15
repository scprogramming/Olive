
module.exports.Configuration = class Configuration{

    constructor(env){
        this.host = env.databaseAddress;
        this.port = env.databasePort;
        this.user = env.databaseUser;
        this.pass = env.databasePassword;
        this.database = env.database;
        this.serverAddress = env.serverAddress;
        this.serverPort = env.serverPort;
        this.jwtKey = env.jwtkey;
        this.tokenExpires = env.tokenExpires;

        if (env.registrationEnabled === 'Yes'){
            this.registrationEnabled = true;
        }else{
            this.registrationEnabled = false;
        }
        
    }
}