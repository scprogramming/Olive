## DbHandler.js

The DbHandler file contains all of the code used to interact with the MySQL database.

### Constructor

**Parameters**

* host: The address of the MySQL database server
* port: The port of the MySQL database server
* user: The username of the user connecting to the MySQL database server
* password: The password of the user connecting to the MySQL database server
* database: The database name you are connecting to

The constructor uses `mysql.createConnection` to construct a connection using the provided parameters. If a connection fails, an error is thrown by the constructor. 

### queryReturnNoParam

**Parameters**

* query: A valid SQL formatted query

This method uses `promise().query()` to run the provided query against the current MySQL connection. The function uses `await` to wait for the database results before returning them to the caller.

This method does not allow any parameters to be provided and should be used for cases where a query does not require any user inputs. 

### queryReturnWithParams

**Parameters** 

* query: A valid SQL formatted query
* params: The parameters required for the SQL query

This method uses `promise().query()` to run a provided query with parameters, using the parameterized query method to prevent risk of SQL injection. The function uses `await` to wait for the database results before returning to the caller.

This method allows for parameters, and should be used to handle any SQL query that requires user inputs.

### close

The close method calls `close()` on the current mySQL connection.