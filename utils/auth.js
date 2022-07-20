const bcrypt = require("bcrypt");

module.exports.registerUser =  async function registerUser(username,userPassword,firstName,lastName,address,postalZipCode,sqlConn){
    try{
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
        console.log(err);
        return -1;
    }
}

module.exports.login = async function login(username,password, sqlConn){
    
    try {
        var sql = "SELECT * FROM user_login WHERE username = ?";

        var result = await sqlConn.queryReturnWithParams(sql,[username]);
        var comp = await bcrypt.compare(password,result[0][0].user_password);
    
        return comp;
    }catch(err){
        return false;
    }
    

}