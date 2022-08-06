# Summary

For the application to run, a number of different configurations are required. This document outlines the required components for the application to run.

## .env File

The .env file contains various components required by the node.js server. The following components are contained in this file:

* The key for JWT tokens
* The token expiry time

### jwtkey

The key used to create and verify JWT. You should pick a long, secure, unique key for your application. 

### tokenExpires

The expiry time for a JWT. If this is set to `none`, no expiry is set on the token. 

### databaseAddress

The address of the database used by the application

### databasePort

The port that the database server is listening on for connections

### databaseUser

The username of the database user used for the application

### databasePassword

The password of the database user

### database

The name of the database where the data will be stored

### Sample Usage

Below is a sample of the `.env` file:

```
jwtkey=SuperSecretJwtKey
tokenExpires=1d
databaseAddress=localhost
databasePort=3306
databaseUser=user
databasePassword=password
database=CmsSystem
```