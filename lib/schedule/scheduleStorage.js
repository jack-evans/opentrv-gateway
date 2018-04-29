'use strict'

const fs = require('fs')
const jsonFile = require('jsonfile')
const path = require('path')
const Promise = require('bluebird')

const scheduleStoragePath = path.normalize(path.join(__dirname, '..', '..', 'scheduleStorage'))

function scheduleStorage () {
  if (!fs.existsSync(scheduleStoragePath)) {
    fs.mkdir(scheduleStoragePath, function (err) {
      if (err) {
        throw err
      }
    })
  }
}

/**
 * createSchedule
 * @param {schedule} schedule - the schedule object
 */
scheduleStorage.prototype.createSchedule = (schedule) => {
  const fileName = path.join(scheduleStoragePath, (schedule.id + '.json'))
  return new Promise((resolve, reject) => {
    jsonFile.writeFile(fileName, schedule, {spaces: 2}, function (err) {
      if (err) {
        reject(err)
      } else {
        jsonFile.readFile(fileName, function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }
    })
  })
}

/**
 * getScheduleById
 * @param {String} scheduleId - the id (document name) of the schedule to be returned
 */
scheduleStorage.prototype.getScheduleById = (scheduleId) => {
  const fileName = scheduleId + '.json'
  return new Promise((resolve, reject) => {
    jsonFile.readFile(path.join(scheduleStoragePath, fileName), function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * getAllSchedules
 */
scheduleStorage.prototype.getAllSchedules = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(scheduleStoragePath, function (err, items) {
      if (err) {
        reject(err)
      } else {
        let numOfItems = items.length
        let promises = []
        if (numOfItems > 0) {
          items.forEach((item, index) => {
            promises.push(readJSONFile(path.join(scheduleStoragePath, item)))
          })
          resolve(Promise.all(promises))
        } else {
          resolve([])
        }
      }
    })
  })
}

function readJSONFile (path) {
  return new Promise((resolve, reject) => {
    jsonFile.readFile(path, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * updateSchedule
 * @param {schedule} schedule - the schedule object to update the current one with
 */
scheduleStorage.prototype.updateSchedule = (schedule) => {
  const fileName = path.join(scheduleStoragePath, (schedule.id + '.json'))
  return new Promise((resolve, reject) => {
    jsonFile.writeFile(fileName, schedule, {spaces: 2}, function (err) {
      if (err) {
        reject(err)
      } else {
        jsonFile.readFile(fileName, function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }
    })
  })
}

/**
 * deleteSchedule
 * @param {String} scheduleId  - the id (document name) of the schedule to be deleted
 */
scheduleStorage.prototype.deleteSchedule = (scheduleId) => {
  const fileName = scheduleId + '.json'
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(scheduleStoragePath, fileName), function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = scheduleStorage
