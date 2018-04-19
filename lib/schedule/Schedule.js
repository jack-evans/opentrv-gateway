'use strict'

const uuidv4 = require('uuid/v4')

/**
 * Schedule constructor
 * @param {String} name              name of the schedule
 * @param {Array } targetTemperature targetTemperatures of the schedules
 * @param {Array } startTime         times when the schedule should start
 * @param {Array } endTime           times when the schedule should end
 * @param {Array } trvsAppliedOn  an array of ids that represent the trvs it is applied on
 */
function Schedule (name, targetTemperature, startTime, endTime, trvsAppliedOn) {
  this.id = uuidv4()
  this.name = name
  this.targetTemperature = targetTemperature
  this.startTime = startTime
  this.endTime = endTime
  this.trvsAppliedOn = trvsAppliedOn
}

module.exports = Schedule
