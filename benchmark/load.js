var ctr = 0;
module.exports = function(){
  	// this object will be serialized to JSON and sent in the body of the request
	ctr  = ctr + 1
	return{
	  email: 'benchmark' + ctr + "@test.com",
	  password: 'test',
	  firstName: 'Bench' + ctr,
	  lastName: 'Mark' + ctr,
	  description: 'Benchmark user number ' + ctr,
	};
};