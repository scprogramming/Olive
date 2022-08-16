const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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

module.exports.login = async function login(email,password, sqlConn,conf){
    
    try {
        var sql = "SELECT * FROM user_login WHERE email = ?";

        var result = await sqlConn.queryReturnWithParams(sql,[email]);
        var comp = await bcrypt.compare(password,result[0][0].user_password);

        var token;

        if (conf.tokenExpires === 'none'){
            token = jwt.sign(
                {user:email},
                conf.jwtKey
            );
        }else{
            token = jwt.sign(
                {user:email},
                conf.jwtKey,
                {
                    expiresIn: conf.tokenExpires
                }
            );
        }
        
    
        return [comp,token];
    }catch(err){
        console.log(err);
        return [false,""];
    }
}

module.exports.verify = async function validateJwt(token,conf){
    if (!token){
        return false;
    }else{
        try{
            const decoded = jwt.verify(token,conf.jwtKey);
            return true;
        }catch(err){
            return false;
        }
    }
}