import { SqlHandler } from './DbHandler.js'
import { getDBParams } from './confHandler.js';
import * as readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('This will delete all of your database data. Are you sure you want to proceed?', input => {
    if (input === 'y'){
        var params = getDBParams();
        var sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],"");
        
        sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystem");
        console.log("Created database");

        sqlConn.close();
        
        sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],params[4]);
        
        sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_login");
        sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_details");
        
        console.log("Dropped tables");

        sqlConn.queryReturnNoParam(`CREATE TABLE user_login(
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(100) NOT NULL,
            user_password VARCHAR(100) NOT NULL,
            active INT NOT NULL,
            role VARCHAR(100),
            PRIMARY KEY(user_id)
            );`);
        
        sqlConn.queryReturnNoParam(`    
            CREATE TABLE user_details(
            user_id INT NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100),
            address VARCHAR(1000),
            postal_zip_code VARCHAR(25)
            );`);
        
        console.log("Created tables");

        sqlConn.close();
        rl.close();
        
    }else{
        console.log("Quitting!");
        rl.close();
    }
})


