var usage = require('usage')

var pid = process.pid;
var options = { keepHistory: true }
usage.lookup(pid, options, function(err, result) {
  console.log(result)
});

