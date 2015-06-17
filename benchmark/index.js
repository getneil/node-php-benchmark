/*
node index.js create/list js/php concurrency
create -> POST
list -> GET

js -> 3003
php -> 4000
 */
var action      = "";
var language    = "";
var concurrency = 0;
var port        = 0;
var method      = "";
var ip          = "localhost";

process.argv.forEach(function (val, index) {
    switch (index) {
        case 2:
            action = val.toLowerCase();
            method = (val == 'CREATE') ? 'POST' : 'GET';
            break;
        case 3:
            language = val;
            port     = (val == 'JS') ? 3003 : 4000;
            break;
        case 4:
            concurrency = +val;
            break;
    }
});
var loadtest    = require('loadtest');
var body        = require('./load');
var options     = {
    url         : 'http://'+ip+':'+port+'/'+action,
    concurrency : concurrency,
    maxRequests : 1,
    maxSeconds  : 1,
    method      : method,
    body        : body,
    contentType : 'application/json',
};
loadtest.loadTest(options, function (error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(result);
    console.log('Tests run successfully');
});