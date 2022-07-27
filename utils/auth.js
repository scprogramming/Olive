const bcrypt = require("bcrypt");

module.exports.registerUser =  async function registerUser(email, userPassword, confirmPassword, firstName, lastName, sqlConn){
    try{

        if (userPassword != confirmPassword){
            return -3
        }
        
        var sql = `SELECT COUNT(*) AS userCount FROM user_login WHERE email = ?`;
        var result = await sqlConn.queryReturnWithParams(sql,[email]);
        
        if (result[0][0].userCount == 0){
            var saltRounds = 10;
            var salt = await bcrypt.genSalt(saltRounds);
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

module.exports.login = async function login(email,password, sqlConn){
    
    try {
        var sql = "SELECT * FROM user_login WHERE email = ?";

        var result = await sqlConn.queryReturnWithParams(sql,[email]);
        var comp = await bcrypt.compare(password,result[0][0].user_password);
    
        return comp;
    }catch(err){
        return false;
    }
    

}