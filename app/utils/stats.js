var _ = require('lodash')

var StatsObject = function() {
  this.createTime = Date.now()
  this.count = 0
  this.error = 0
  this.warn = 0
  this.timeTotal = 0
  this.timeMax = 0
  this.timeMin = 0
  this.timeAve = 0
}

StatsObject.prototype.add = function(count, error, warn, timeUse) {
  this.count += count
  this.error += error
  this.warn += warn
  this.timeTotal += timeUse
  if (this.timeMax < timeUse) {
    this.timeMax = timeUse
  }
  if (this.timeMin > timeUse) {
    this.timeMin = timeUse
  }
}

StatsObject.prototype.calculateTimeAve = function() {
  this.timeAve = Math.round(this.timeTotal / this.count) || 0
}

var Stats = function() {
  this.total = new StatsObject()
  this.entities = {}
}

Stats.prototype.reset = function() {
  this.total = new StatsObject()
  this.entities = {}
}

Stats.prototype.get = function() {
  this.total.calculateTimeAve()
  _.each(this.entities, function(entity){
    entity.calculateTimeAve()
  })
  return this
}

Stats.prototype.add = function(entity, count, error, warn, timeUse) {
  this.total.add(count, error, warn, timeUse)
  if (_.isNil(this.entities[entity])) {
    this.entities[entity] = new StatsObject()
  }
  this.entities[entity].add(count, error, warn, timeUse)
}

module.exports = Stats
