import { SqlHandler } from "./DbHandler.js";
import * as bcrypt from "bcrypt";
import { getDBParams } from "./handlers/confHandler.js";

export async function registerUser(username,userPassword,firstName,lastName,address,postalZipCode){
    try{
        var params = getDBParams();
        var sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],params[4]);

        var sql = `SELECT COUNT(*) AS userCount FROM user_login WHERE username = ?`;
        var result = await sqlConn.queryReturnWithParams(sql,[username]);
        
        if (result[0][0].userCount == 0){
            var saltRounds = 10;
            var salt = await bcrypt.genSalt(saltRounds);
            var passwordHash = await bcrypt.hash(userPassword,salt);
    
            var sql = `INSERT INTO user_login(username,user_password,active,role)
            VALUES (?,?,1,'user')`;
    
            result = await sqlConn.queryReturnWithParams(sql,[username,passwordHash]);
            var userId = result[0].insertId;
    
            var sql = `INSERT INTO user_details
            VALUES (?,?,?,?,?)`;
    
            sqlConn.queryReturnWithParams(sql,[userId,firstName,lastName,address,postalZipCode]);
    
            return 1;
        }else{
            return -2;
        }

    } catch (err){
        return -1;
        
    }



}