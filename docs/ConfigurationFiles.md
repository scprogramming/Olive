# Summary

For the application to run, a number of different configurations are required. This document outlines the required components for the application to run.

## .env File

The .env file contains various components required by the node.js server. The following components are contained in this file:

* The key for JWT tokens
* The token expiry time

### jwtkey

The parameter `jwtkey` represents the key used to create and verify JWT. You should pick a long, secure, unique key for your application. 

### tokenExpires

The paramter `tokenExpires` represents the expiry time for a JWT. If this is set to `none`, no expiry is set on the token. 

### Sample Usage

Below is a sample of the `.env` file:

```
jwtkey=SuperSecretJwtKey
tokenExpires=1d
```

This example defines the `jwtkey` as `SuperSecretJwtKey` and the `tokenExpires` field to expire the JWT in 1 day. 


