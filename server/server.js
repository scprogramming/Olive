const server = require('./app.js');

server.app.listen(5000, () => {
    console.log("Server started");
});