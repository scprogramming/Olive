import { SqlHandler } from "./DbHandler";
import {bcrypt} from "bcrypt";
import { getDBParams } from "./confHandler";

export function registerUser(username,userPassword,firstName,lastName,address,postalZipCode){
    
    try{
        var params = getDBParams();
        var sqlConn = new SqlHandler(params[0],params[1],params[2],params[3],params[4]);

        var saltRounds = 10;
        var salt = await bcrypt.genSalt(saltRounds);
        var passwordHash = await bcrypt.hash(userPassword,salt);

        var sql = `INSERT INTO user_login(username,user_password,active,role)
        VALUES (?,?,1,'user')`;

        var result = sqlConn.queryReturnWithParams(sql,username,userPassword);
    } catch (err){
        
    }



}