import { SqlHandler } from './DbHandler.js'
import { getDBParams } from './confHandler.js';


var params = getDBParams();
var sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],"");

await sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystem");

sqlConn.close();

sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],params[4]);

await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_login");
await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_details");

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

sqlConn.close();

