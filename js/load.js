var ctr = 0;
module.exports = function(requestId) {
  // this object will be serialized to JSON and sent in the body of the request
  ctr = ctr + 1
  return {

    email: 'benchmark' + ctr + "@test.com",
    password:,
    firstName: 'Bench' + ctr,
    lastName: 'Mark' + ctr,
    description: 'Benchmark user number ' + ctr,

  };
};