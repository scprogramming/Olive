const dbHandle = require("./handlers/DbHandler.js");
const readline = require("readline");
const fs = require('fs');
const dotenv = require("dotenv");
const {Input,AutoComplete} = require('enquirer');
const { getEnabledCategories } = require("trace_events");

dotenv.config();

async function runQueries(sqlConn){
    await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_login");
    await sqlConn.queryReturnNoParam("DROP TABLE IF EXISTS user_details");
    
    console.log("Dropped tables");

    await sqlConn.queryReturnNoParam(`CREATE TABLE user_login(
        user_id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL,
        user_password VARCHAR(100) NOT NULL,
        active INT NOT NULL,
        role VARCHAR(100),
        PRIMARY KEY(user_id)
        );`);
    
    await sqlConn.queryReturnNoParam(`    
        CREATE TABLE user_details(
        user_id INT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100)
        );`);
    
    await sqlConn.queryReturnNoParam(`    
    CREATE TABLE posts(
    post_id DECIMAL(18,0) NOT NULL,
    article_title VARCHAR(250) NOT NULL,
    content longtext,
    dateCreated DATE,
    category_id INT
    );`);
    
    await sqlConn.queryReturnNoParam(`
    CREATE TABLE categories(
        category_id INT,
        category_name VARCHAR(100)
        );
    `)

    await sqlConn.queryReturnNoParam(`
    CREATE TABLE sessions
	(session_id VARCHAR(256),
      user_id int(11),
      expiry DATE
      );
      `)

    await sqlConn.queryReturnNoParam(`
    CREATE TABLE pages(
        page_id INT(11),
        page_title VARCHAR(250),
        content LONGTEXT,
        date_created DATE
        
    );
    `)

    console.log("Created tables");

    sqlConn.close();
}

const proceed = new AutoComplete({
    name:'confirm',
    message: 'This will delete all of your database data in your target database. Are you sure you want to proceed?',
    initial: 1,
    choices: [
        'Yes',
        'No'
    ]
});

const jwtKeyIn = new Input({
    name:'jwtKeyIn',
    message:'Enter a secret key for your JWT'
});

const tokenExpiryIn = new Input({
    name:'tokenExpiryIn',
    initial:'none',
    message:'Enter the expiry time for your JWT (enter none for no expiry)'
});

const databaseAddressIn = new Input({
    name:'databaseAddressIn',
    initial:'localhost',
    message:'Enter the address of your database'
});

const databasePortIn = new Input({
    name:'databasePortIn',
    initial: '3306',
    message:'Enter the port of your database'
});

const databaseUserIn = new Input({
    name:'databaseUserIn',
    message:'Enter the username of your database user'
});

const databasePasswordIn = new Input({
    name:'databasePasswordIn',
    message:'Enter the password of your database user'
});

const databaseNameIn = new Input({
    name:'databaseNameIn',
    initial:'CmsSystem',
    message:'Enter the desired name of your CMS database'
});

const serverAddressIn = new Input({
    name:'serverAddressIn',
    initial:'http://localhost',
    message:'Enter the address of your application server'
});

const serverPortIn = new Input({
    name:'serverPortIn',
    initial:'5000',
    message:'Enter the port of your application server'
});

const enableRegistrationIn = new AutoComplete({
    name:'enabledRegitrationIn',
    message:'Allow users to register on the site?',
    initial: 1,
    choices: [
        'Yes',
        'No'
    ]
});

const testDbToggle = new AutoComplete({
    name:'testDbToggle',
    message:'Enable test DB? (should be used for development only)',
    initial: 1,
    choices: [
        'Yes',
        'No'
    ]
});

const main = async() => {
    const confirm = await proceed.run();

    if (confirm === 'Yes'){

        const jwtKey = await jwtKeyIn.run();
        const tokenExpiry = await tokenExpiryIn.run();
        const databaseAddress = await databaseAddressIn.run();
        const databasePort = await databasePortIn.run();
        const databaseUser = await databaseUserIn.run();
        const databasePassword = await databasePasswordIn.run();
        const databaseName = await databaseNameIn.run();
        const serverAddress = await serverAddressIn.run();
        const serverPort = await serverPortIn.run();
        const allowRegistration = await enableRegistrationIn.run();
        const enableTestDb = await testDbToggle.run();

        const envFile = '.env';

        fs.writeFileSync(envFile,'jwtkey=' + jwtKey + '\n', (err) => {
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'tokenExpires=' + tokenExpiry + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'databaseAddress=' + databaseAddress + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'databasePort=' + databasePort + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'databaseUser=' + databaseUser + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'databasePassword=' + databasePassword + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'database=' + databaseName + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'serverAddress=' + serverAddress + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'serverPort=' + serverPort + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'registrationEnabled=' + allowRegistration + '\n', (err) =>{
            if (err) throw err;
        });

        fs.appendFileSync(envFile,'saltRounds=10\n', (err) =>{
            if (err) throw err;
        });

        var sqlConn = new dbHandle.SqlHandler(databaseAddress,
            databasePort,databaseUser,databasePassword,"");
        
        await sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystem");

        if (enableTestDb === 'Yes'){
            await sqlConn.queryReturnNoParam("CREATE DATABASE IF NOT EXISTS CmsSystemTest")
        }
        
        console.log("Created database");

        sqlConn.close();
        
        sqlConn = new dbHandle.SqlHandler(databaseAddress,
            databasePort,databaseUser,databasePassword,
            databaseName);
        
        await runQueries(sqlConn);
        sqlConn.close();

        if (enableTestDb === 'Yes'){
            sqlConn = new dbHandle.SqlHandler(databaseAddress,
                databasePort,databaseUser,databasePassword,"CmsSystemTest");
            await runQueries(sqlConn);
            
            sqlConn.close();
        }
        
    }else{
        console.log("Quitting!");
    }
}

main()
