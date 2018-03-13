'use strict'

const uuidv4 = require('uuid/v4')

/**
 * This constructor helps to keep the data stored of a consistent format
 */

/**
 * The TRV object
 */
function Trv (currentTemperature, targetTemperature, ambientTemperature, name) {
  this.id = uuidv4()
  this.currentTemperature = currentTemperature || undefined
  this.targetTemperature = targetTemperature || ambientTemperature
  this.ambientTemperature = ambientTemperature || undefined
  this.name = name || undefined
  this.serialId = _generateSerialId()
  this.active = false
  this.activeSchedules = []
  this.metadata = {}
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
