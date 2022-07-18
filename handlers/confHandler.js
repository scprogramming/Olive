import * as fs from 'fs'

export function getDBParams(){
    const data = fs.readFileSync('./app.conf',
    {encoding:'utf-8',flags:'r'});

    var params = data.split(',');

    for (var i = 0; i < params.length; i++){
        params[i] = params[i].trim();
    }

    return params;
}