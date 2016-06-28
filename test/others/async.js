var async = require('async')

async.parallel({
  one: function(callback){
    callback(null, 1, 2)
  },
  err: function(callback){
    callback(null, new Error(), 3)
  }
},
function(err, results){
  console.log(err)
  console.log(results)
})
