var _ = require('lodash')

console.log('_.isNil(0) = ' + _.isNil(0))
console.log('_.isNil(void(0)) = ' + _.isNil(void(0)))
console.log('_.isNil(null) = ' + _.isNil(null))
console.log('_.isNil(undefined) = ' + _.isNil(undefined))

console.log(_.union([2], [1, 2]))

var users = {
  'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};

var ages = {
  'data': [{ 'age': 36 }, { 'age': 40 }]
};

console.log(_.merge(users, ages))

_.each([1, 2, 3], function(v, k){
  console.log(k, v)
})