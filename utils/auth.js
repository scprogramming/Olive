const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const dateUtil = require("../utils/dateUtil");

dotenv.config();

module.exports.registerUser =  async function registerUser(email, userPassword, confirmPassword, firstName, lastName, sqlConn,conf){
    try{

        if (userPassword != confirmPassword){
            return -3
        }
        
        var sql = `SELECT COUNT(*) AS userCount FROM user_login WHERE email = ?`;
        var result = await sqlConn.queryReturnWithParams(sql,[email]);
        
        if (result[0][0].userCount == 0){
            var salt = await bcrypt.genSalt(parseInt(conf.saltRounds));
            var passwordHash = await bcrypt.hash(userPassword,salt);
    
            var sql = `INSERT INTO user_login(email,user_password,active,role)
            VALUES (?,?,1,'user')`;
    
            result = await sqlConn.queryReturnWithParams(sql,[email,passwordHash]);
            var userId = result[0].insertId;
    
            var sql = `INSERT INTO user_details
            VALUES (?,?,?)`;
    
            sqlConn.queryReturnWithParams(sql,[userId,firstName,lastName]);
    
            return 1;
        }else{
            return -2;
        }

    } catch (err){
        console.log(err);
        return -1;
    }
}

function generateExpiry(expiry){
    let today = new Date();

    if (expiry.includes("d")){
        let days = expiry.substring(0,expiry.indexOf("d"));
        days = parseInt(days);
        today.setDate(today.getDate() + days);
        return today;
    }
}

module.exports.login = async function login(email,password, sqlConn,conf){
    
    try {
        var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var sql = "SELECT * FROM user_login WHERE email = ?";
        var charLength = characters.length;

        var result = await sqlConn.queryReturnWithParams(sql,[email]);
        var comp = await bcrypt.compare(password,result[0][0].user_password);

        if (comp){
            var token = "";

            for (let i = 0; i < 256; i++){
                token += characters.charAt(Math.floor(Math.random() * charLength))
            }

            if (conf.tokenExpires === 'none'){
                sqlConn.queryReturnWithParams("INSERT INTO sessions VALUES (?,?,null)",[token,result[0][0].user_id]);
            }else{
                let expiryDate = generateExpiry(conf.tokenExpires);
                let dateList = dateUtil.parseDate(expiryDate);

                sqlConn.queryReturnWithParams("INSERT INTO sessions VALUES (?,?,?)",[token,result[0][0].user_id,dateList[0] + '-' + dateList[1] + '-' + dateList[2]]);
            }

            return [comp,token];
        }else{
            return [comp,""];
        }
        
        
    }catch(err){
        console.log(err);
        return [false,""];
    }
}

module.exports.verify = async function verify(sqlConn, token,requiredRole){
    if (!token){
        return [false,1];
    }else{
        try{

            const parseTok = token.substring(token.indexOf("=")+1);
            
            let result = await sqlConn.queryReturnWithParams(`SELECT expiry,active,role FROM sessions 
            INNER JOIN user_login ON user_login.user_id = sessions.user_id
            WHERE session_id=?;
            `,[parseTok]);

            if (result[0].length != 0){
                let expiry = dateUtil.parseDate(result[0][0].expiry);
                let today = dateUtil.parseDate(new Date());

                if (parseInt(expiry[0]) >= parseInt(today[0]) && parseInt(expiry[1]) >= parseInt(today[1]) && parseInt(expiry[2]) >= parseInt(today[2])){
                    if (result[0][0].active == "1"){
                        if (result[0][0].role == requiredRole){
                            return [true,0];
                        }else{
                            return [false,2];
                        }
                    }else{
                        return [false,3];
                    }
                    
                }else{
                    return [false,4];
                }

            }else{
                return [false,5];
            }
            
        }catch(err){
            console.log(err);
            return [false,6];
        }
    }
}