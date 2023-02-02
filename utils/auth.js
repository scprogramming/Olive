const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const dateUtil = require("../utils/dateUtil");

dotenv.config();

module.exports.registerUser =  async function registerUser(email, userPassword, confirmPassword, firstName, lastName, mongoConn,conf){
    try{

        if (userPassword != confirmPassword){
            return -3
        }

        let checkEmail = await mongoConn.singleFind("Users", {email:email});
        
        if (checkEmail === null){
            var salt = await bcrypt.genSalt(parseInt(conf.saltRounds));
            var passwordHash = await bcrypt.hash(userPassword,salt);
    
            await mongoConn.singleInsert("Users", {email:email,user_password:passwordHash,active:1,role:"user",first_name:firstName, last_name:lastName});
    
            return 1;
        }else{
            return -2;
        }

    } catch (err){
        console.error(err);
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

module.exports.logout = async function logout(mongoConn,sessionId){
    try{
        const session = await mongoConn.singleFind("Sessions", {session_id:sessionId});
        mongoConn.singleDeleteWithId("Sessions",session._id);
    }catch(err){
        console.error(err);
    }
}

module.exports.login = async function login(email,password, mongoConn,tokenExpires){
    
    try {
        var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        const user = await mongoConn.singleFind("Users", {email:email});
        var charLength = characters.length;
        let comp = false;

        if (user !== null){
            comp = await bcrypt.compare(password,user.user_password);
        }
        
        if (comp){
            var token = "";

            for (let i = 0; i < 256; i++){
                token += characters.charAt(Math.floor(Math.random() * charLength))
            }

            if (tokenExpires === 'none'){
                await mongoConn.singleInsert("Sessions", {session_id:token, user_email:email, expiry:null})
            }else{
                let expiryDate = generateExpiry(tokenExpires);
                let dateList = dateUtil.parseDate(expiryDate);

                await mongoConn.singleInsert("Sessions", {session_id:token, user_email:email, expiry: dateList[0] + '-' + dateList[1] + '-' + dateList[2]});
            }

            return [comp,token];
        }else{
            return [comp,""];
        }
        
        
    }catch(err){
        console.error(err);
        return [false,""];
    }
}

module.exports.checkAuthStatus = async function checkAuthStatus(mongoConn,role,cookie){
    let authStatus = false;

    if (cookie !== undefined){
        const authRes = await this.verify(mongoConn, cookie, "user",conf);
        if (authRes !== undefined){
            if (authRes[0]){
                authStatus = true;
            }
        }
        
    }

    return authStatus;
}

module.exports.verify = async function verify(mongoConn, token,requiredRole,conf){
    if (!token){
        return [false,-1];
    }else{
        try{

            const parseTok = token.substring(token.indexOf("=")+1);

            let checkSession = await mongoConn.singleFind("Sessions", {session_id:parseTok});

            if (checkSession !== null){
                let checkActive = await mongoConn.singleFind("Users", {email:checkSession.user_email});

                if (checkActive === null || checkActive.active === 0){
                    [false,-1]
                }else{
                    if (conf.tokenExpires === 'none'){
                        if (checkActive.role === requiredRole || checkActive.role === 'admin'){
                            return [true,0];
                        }else{
                            return [false,-1];
                        }
                    }else{
                        let expiry = dateUtil.parseDate(checkSession.expiry);
                        let today = dateUtil.parseDate(new Date());

                        if (parseInt(expiry[0]) >= parseInt(today[0]) && parseInt(expiry[1]) >= parseInt(today[1]) && parseInt(expiry[2]) >= parseInt(today[2])){
                            if (checkActive.role === requiredRole || checkActive.role === 'admin'){
                                return [true,0];
                            }else{
                                return [false,-1];
                            }
                        }
                    }
                }
            }

            
        }catch(err){
            console.error(err);
            return [false,6];
        }
    }
}