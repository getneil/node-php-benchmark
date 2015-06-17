module.exports = function(params, options, client, callback) {
  generateMessageAsync(function(message)) {
    request = client(options, callback);
 
    if (message)
    {
      options.headers['Content-Length'] = message.length;
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      request.write(message);
    }
 
    request.end();
  }
}