'use strict'

const uuidv4 = require('uuid/v4')

/**
 * The TRV object
 */
function Trv (currentTemperature, targetTemperature, ambientTemperature, name) {
  this.id = uuidv4()
  this.currentTemperature = currentTemperature || undefined
  this.targetTemperature = targetTemperature || undefined
  this.ambientTemperature = ambientTemperature || undefined
  this.name = name || undefined
  this.serialId = _generateSerialId()
  this.active = false
  this.activeSchedules = []
}

Trv.prototype.getCurrentTemperature = function () {
  return _roundToOneDP(this.currentTemperature)
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

/**
 * _generateSerialId method
 *
 * Generates a 15 character alphanumeric unique string for the device
 * @returns {string} - "OTRV-" plus 10 alphanumeric values
 * @private
 */
const _generateSerialId = () => {
  let serialId = 'OTRV-'
  const possibleValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let i = 0; i < 10; i++) {
    serialId += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length))
  }
  return serialId
}

module.exports = Trv
