'use strict'

const uuidv4 = require('uuid/v4')

function Schedule (name, targetTemperature, startTime, endTime, devicesAppliedOn) {
  this.id = uuidv4()
  this.name = name
  this.targetTemperature = targetTemperature
  this.startTime = startTime
  this.endTime = endTime
  this.devicesAppliedOn = devicesAppliedOn
}
