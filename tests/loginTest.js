const sqlHandle = require('../handlers/DbHandler');
const dotenv = require("dotenv");
const config = require("../utils/configuration")

const failedTests = [];
let successfulTests = 0;
let totalTests = 0;

async function sendRegistrationRequest(jsonBody){
    const res = await fetch('http://localhost:5000/api/registration', {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body:jsonBody
        
    });
    const result = await res.json();

    return result;
}

async function sendRequest(jsonBody){
    const res = await fetch('http://localhost:5000/api/login', {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body:jsonBody
        
    });
    const result = await res.json();

    return result;
}

async function validRegistration(){
    
    let reqBody = JSON.stringify({email:"a@email.com", user_password:"123456", confirm_password:"123456", first_name:"Scott", last_name:"C"})
    
    const result = await sendRegistrationRequest(reqBody);

    if (result.code == 1){
        console.log('\x1b[32m%s\x1b[0m', 'Registration succeeded!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'Registration has failed');
    }

}

async function validLogin(){
    
    let reqBody = JSON.stringify({email:"a@email.com", user_password:"123456"})
    
    const result = await sendRequest(reqBody);

    if (result.code == 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'validLogin test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'validLogin test failed with status: ' + result.status);
        failedTests.push('validLogin');
    }

}

async function invalidLogin(){
    
    let reqBody = JSON.stringify({email:"a@email.com", user_password:"1234567"})
    
    const result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'invalidLogin test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'invalidLogin test failed with status: ' + result.status);
        failedTests.push('invalidLogin');
    }

}

async function loginEmptyFields(){
    
    let reqBody = JSON.stringify({email:"a@email.com", user_password:""})
    
    let result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'loginEmptyFields empty password test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'loginEmptyFields empty password test failed with status: ' + result.status);
        failedTests.push('loginEmptyFields: password');
    }

    reqBody = JSON.stringify({email:"", user_password:"123456"})
    
    result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'loginEmptyFields empty email test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'loginEmptyFields empty email test failed with status: ' + result.status);
        failedTests.push('loginEmptyFields: email');
    }

    reqBody = JSON.stringify({email:"", user_password:""})
    
    result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'loginEmptyFields all empty fields test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'loginEmptyFields all empty fields test failed with status: ' + result.status);
        failedTests.push('loginEmptyFields: all fields');
    }

}

async function runTests(sqlConn){

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE sessions');

    await validRegistration();
    
    await validLogin();
    totalTests += 1;
    await invalidLogin();
    totalTests += 1;

    await loginEmptyFields();
    totalTests += 3;

    if (successfulTests == totalTests){
        console.log('\x1b[32m%s\x1b[0m', 'All tests succeeded!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'Tests were failed in registration');
        console.log(failedTests);
    }

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE sessions');

    process.exit();
}

dotenv.config();
conf = new config.Configuration(process.env);
conf.database = "cmssystemtest";

const sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
    conf.user,conf.pass,conf.database);

console.log('\x1b[32m%s\x1b[0m', 'Starting Login Tests');
runTests(sqlConn);