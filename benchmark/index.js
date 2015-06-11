var loadtest = require('loadtest');
var body     = require('./load');
var ip = "192.168.9.2";
var port  = 3003;
var method = "GET";

var options  = {
    // url: 'http://'+ip+':'+port+'/create',
    url: 'http://'+ip+':'+port+'/list',
    concurrency: 2000,
    // maxRequests: 1000,
    maxSeconds: 60,
    method: method,
    // method: 'POST',
    // body: body,
    contentType: 'application/json',
    // requestsPerSecond: 300,
};
loadtest.loadTest(options, function (error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(error, result);
    console.log('Tests run successfully');
});