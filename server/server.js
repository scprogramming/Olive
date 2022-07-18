const server = require('./app.js');
const conf = require('../handlers/confHandler.js');

const params = conf.getDBParams();
const appServer = new server.appServer(params[0],params[1],params[2],params[3],params[4]);

appServer.app.listen(5000, () => {
    console.log("Server started");
});