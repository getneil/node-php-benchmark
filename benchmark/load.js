var ctr = 0;
module.exports = {
  // this object will be serialized to JSON and sent in the body of the request
  foo: function() {
    ctr  = ctr + 1
    data = {
      email: 'benchmark' + ctr + "@test.com",
      password: 'test',
      firstName: 'Bench' + ctr,
      lastName: 'Mark' + ctr,
      description: 'Benchmark user number ' + ctr,

    };
    return data;
  }
};