import { SqlHandler } from './handlers/DbHandler.js'
import { getDBParams } from './handlers/confHandler.js';
import * as readline from 'readline'

async function runQueries(sqlConn){
    await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_login");
    await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_details");
    
    console.log("Dropped tables");

    await sqlConn.queryReturnNoParam(`CREATE TABLE user_login(
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        user_password VARCHAR(100) NOT NULL,
        active INT NOT NULL,
        role VARCHAR(100),
        PRIMARY KEY(user_id)
        );`);
    
    await sqlConn.queryReturnNoParam(`    
        CREATE TABLE user_details(
        user_id INT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        address VARCHAR(1000),
        postal_zip_code VARCHAR(25)
        );`);
    
    console.log("Created tables");
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('This will delete all of your database data. Are you sure you want to proceed?', async(input) => {
    if (input === 'y'){
        var params = getDBParams();
        var sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],"");
        
        await sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystem");
        await sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystemTest")
        console.log("Created database");

        sqlConn.close();
        
        sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],params[4]);
        
        await runQueries(sqlConn);
        sqlConn.close();

        sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],"CmsSystemTest");
        await runQueries(sqlConn);

        sqlConn.close();
        rl.close();
        
    }else{
        console.log("Quitting!");
        rl.close();
    }
})


