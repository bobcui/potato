var fun = module.exports;

fun.invokeCallback = function(cb) {
  if ( !! cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1))
  }
}