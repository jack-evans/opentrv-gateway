'use strict'

/**
 * The TRV object
 */

function Trv (currentTemperature, targetTemperature, ambientTemperature, name) {
  this.currentTemperature = currentTemperature || undefined
  this.targetTemperature = targetTemperature || undefined
  this.ambientTemperature = ambientTemperature || undefined
  this.name = name || undefined
  this.serialId = null
  this.active = null
}

Trv.prototype.getCurrentTemperature = function () {
  return this.currentTemperature
}

Trv.prototype.getTargetTemperature = function () {
  return this.targetTemperature
}

Trv.prototype.setTargetTemperature = function (temp) {
  this.targetTemperature = temp
}

Trv.prototype.getAmbientTemperature = function () {
  return this.ambientTemperature
}

Trv.prototype.getName = function () {
  return this.name
}

Trv.prototype.setName = function (name) {
  this.name = name
}

Trv.prototype.getSerialId = function () {
  return this.serialId
}

Trv.prototype.isActive = function () {
  return this.active
}

Trv.prototype.setActive = function (active) {
  this.active = active
}



module.exports = Trv
