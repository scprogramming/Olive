const sqlHandle = require('../handlers/DbHandler');
const dotenv = require("dotenv");
const config = require("../utils/configuration")

const failedTests = [];
let successfulTests = 0;
let totalTests = 0;

async function sendRequest(jsonBody){
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

async function validRegistration(){
    
    let reqBody = JSON.stringify({email:"a@email.com", user_password:"123456", confirm_password:"123456", first_name:"Scott", last_name:"C"})
    
    const result = await sendRequest(reqBody);

    if (result.code == 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'validRegistration test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'validRegistration test failed with status: ' + result.status);
        failedTests.push('validRegistration');
    }

}

async function emptyRegistration(){
    
    let reqBody = JSON.stringify({email:"", user_password:"", confirm_password:"", first_name:"", last_name:""})
    
    const result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'emptyRegistration test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'emptyRegistration test failed with status: ' + result.status);
        failedTests.push('emptyRegistration');
    }

}

async function mismatchPasswordRegistration(){
    
    let reqBody = JSON.stringify({email:"1", user_password:"1", confirm_password:"2", first_name:"1", last_name:"1"})
    
    const result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'mismatchPasswordRegistration test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'mismatchPasswordRegistration test failed with status: ' + result.status);
        failedTests.push('mismatchPasswordRegistration');
    }

}

async function missingParametersRegistration(){
    
    let reqBody = JSON.stringify({email:"", user_password:"1", confirm_password:"1", first_name:"1", last_name:"1"})
    
    let result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'missingParametersRegistration: no email case test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'missingParametersRegistration:no email case test failed with status: ' + result.status);
        failedTests.push('missingParametersRegistration: email case failed');
    }

    reqBody = JSON.stringify({email:"1", user_password:"", confirm_password:"", first_name:"1", last_name:"1"})
    
    result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'missingParametersRegistration: no password case test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'missingParametersRegistration:no password case test failed with status: ' + result.status);
        failedTests.push('missingParametersRegistration: password case failed');
    }

    reqBody = JSON.stringify({email:"2", user_password:"1", confirm_password:"1", first_name:"", last_name:"1"})
    
    result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'missingParametersRegistration: no first name case test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'missingParametersRegistration:no first name case test failed with status: ' + result.status);
        failedTests.push('missingParametersRegistration: first name case failed');
    }

    reqBody = JSON.stringify({email:"3", user_password:"1", confirm_password:"1", first_name:"1", last_name:""})
    
    result = await sendRequest(reqBody);

    if (result.code != 1){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'missingParametersRegistration: no last name case test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'missingParametersRegistration:no last name case test failed with status: ' + result.status);
        failedTests.push('missingParametersRegistration: last name case failed');
    }

}

async function checkRegistrationInDatabase(sqlConn){
    let res = await sqlConn.queryReturnNoParam(`SELECT * FROM user_login 
    INNER JOIN user_details ON user_login.user_id = user_details.user_id
    WHERE user_login.user_id = 1`)

    const data = res[0][0];

    if (data.user_id == 1 && data.email === 'a@email.com' && data.active == 1 && data.role === 'user' && data.first_name === 'Scott' && data.last_name === 'C'){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'checkRegistrationInDatabase test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'checkRegistrationInDatabase test failed with status: ' + result.status);
        failedTests.push('checkRegistrationInDatabase');
    }

    return;
}

async function duplicateUsername(){
    const res = await fetch('http://localhost:5000/api/registration', {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body:JSON.stringify({email:"a@email.com", user_password:"123456", confirm_password:"123456", first_name:"Scott", last_name:"C"})
        
    });

    const result = await res.json();

    if (result.code == -2){
        successfulTests += 1;
        console.log('\x1b[32m%s\x1b[0m', 'duplicateUsername test successful!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'duplicateUsername test failed with status: ' + result.status);
        failedTests.push('duplicateUsername');
    }

}

async function runTests(sqlConn){

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');

    await validRegistration();
    totalTests += 1;
    await checkRegistrationInDatabase(sqlConn);
    totalTests += 1;
    await duplicateUsername();
    totalTests += 1;

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');

    await emptyRegistration();
    totalTests += 1;

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');

    await missingParametersRegistration();
    totalTests += 4;

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');

    await mismatchPasswordRegistration();
    totalTests += 1;

    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_details');
    await sqlConn.queryReturnNoParam('TRUNCATE TABLE user_login');

    if (successfulTests == totalTests){
        console.log('\x1b[32m%s\x1b[0m', 'All tests succeeded!');
    }else{
        console.log('\x1b[31m%s\x1b[0m', 'Tests were failed in registration');
        console.log(failedTests);
    }
    process.exit();
}

dotenv.config();
conf = new config.Configuration(process.env);
conf.database = "cmssystemtest";

const sqlConn = new sqlHandle.SqlHandler(conf.host,conf.port,
    conf.user,conf.pass,conf.database);

console.log('\x1b[32m%s\x1b[0m', 'Starting Registration Tests');
runTests(sqlConn);
