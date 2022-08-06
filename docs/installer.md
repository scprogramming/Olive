# Installer File

This package comes with a built in installer that can be used to initialize the program. This document will outline how the installer works

## Prerequisites

To run the server, you will need:

* A database server running, with the server and port set in the [.env file](ConfigurationFiles.md)
* A database user created with permission to create databases on the server. The database user and password must be added to the [.env file](ConfigurationFiles.md)

## Installer Process

The installer is designed to create a production database, as well as a test database for the application. You can disable the test database by setting `installTest` to 0 in the `.env` file.

Here is the default installation process for the application:

1. The installer will prompt you to verify if you are ok with deleting your existing database data.
2. If the answer is no, the installer quits. If the answer is yes, the installer continues.
3. The installer creates the database defined in the `database` parameter of the `.env` file. If `installTest` is set to 1, a test database is also installed with test appended to the `database` parameter name.
4. The installer creates the required tables for the production database. It will also initialize the test database if applicable. 

Once the installer is completed, you will be able to run the application.

## See Also
 
* How to [run the application server](server.md)