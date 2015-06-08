var loadtest = require('loadtest');
var body     = require('./load');
data         = body.foo;
var options  = {
    url: 'http://192.168.9.5:5000/create',
    maxRequests: 1000,
    concurrency: 1000,
    maxSeconds: 30,
    contentType: 'application/json',
    method: 'POST',
    body: data
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