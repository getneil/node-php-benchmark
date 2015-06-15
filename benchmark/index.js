var loadtest = require('loadtest');
var body     = require('./load');
var ip = "192.168.9.5";
var port  = 4000;
var method = "POST";
var options  = {
    // url: 'http://'+ip+':'+port+'/create',
    url: 'http://'+ip+':'+port+'/',
    concurrency: 1,
    maxRequests: 1,
    maxSeconds: 1,
    method: method,
    body: body,
    // contentType: 'application/x-www-form-urlencoded'
    contentType: 'application/json',
    // requestsPerSecond: 300,
};
loadtest.loadTest(options, function (error, result)
{
    console.log(options,'opt')
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(error, result);
    console.log('Tests run successfully');
});