'use strict'

const uuidv4 = require('uuid/v4')

/**
 * Schedule constructor
 * @param {String} name              name of the schedule
 * @param {Array } targetTemperature targetTemperatures of the schedules
 * @param {Array } startTime         times when the schedule should start
 * @param {Array } endTime           times when the schedule should end
 * @param {Array } devicesAppliedOn  an array of ids that represent the devices it is applied on
 */
function Schedule (name, targetTemperature, startTime, endTime, devicesAppliedOn) {
  this.id = uuidv4()
  this.name = name
  this.targetTemperature = targetTemperature
  this.startTime = startTime
  this.endTime = endTime
  this.devicesAppliedOn = devicesAppliedOn
}

module.exports = Schedule
