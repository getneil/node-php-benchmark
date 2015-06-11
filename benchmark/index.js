var loadtest = require('loadtest');
var body     = require('./load');

var options  = {
    // url: 'http://localhost:3003/create',
    url: 'http://localhost:3003/list',
    // concurrency: 1000,
    // maxRequests: 1000,
    maxSeconds: 60,
    method: 'GET',
    // method: 'POST',
    // body: body,
    contentType: 'application/json',
    requestsPerSecond: 300,
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