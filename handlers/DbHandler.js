const mysql = require('mysql2');

module.exports.SqlHandler = class SqlHandler{
    constructor(host,port,user,pass,database){
        this.mySqlConn = mysql.createPool({
            connectionLimit: 99,
            host:host,
            port:port,
            user:user,
            password:pass,
            database:database
        });

    }

    async queryReturnNoParam(query){
        var result = await this.mySqlConn.promise().query(query);
        return result;
    }

    async queryReturnWithParams(query,params){
        var result = await this.mySqlConn.promise().query(query,params);
        return result;
    }
}