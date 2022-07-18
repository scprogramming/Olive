const fs = require('fs');

module.exports.testMode = false;

module.exports.getDBParams = function getDBParams(){
    const data = fs.readFileSync('./app.conf',
    {encoding:'utf-8',flags:'r'});

    var params = data.split(',');

    for (var i = 0; i < params.length; i++){
        if (testMode && i == 4){
            params[i] = "CmsSystemTest";
        }else{
            params[i] = params[i].trim();
        }
        
    }

    return params;
}