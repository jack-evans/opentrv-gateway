'use strict'

const fs = require('fs')
const jsonFile = require('jsonfile')
const path = require('path')
const Promise = require('bluebird')

const trvStoragePath = path.normalize(path.join(__dirname, '..', '..', 'trvStorage'))

function trvStorage () {
  if (!fs.existsSync(trvStoragePath)) {
    fs.mkdir(trvStoragePath, function (err) {
      if (err) {
        throw err
      }
    })
  }
}

/**
 * createTrv
 * @param {Trv} trv - the trv object
 */
trvStorage.prototype.createTrv = (trv) => {
  const fileName = path.join(trvStoragePath, (trv.id + '.json'))
  return new Promise((resolve, reject) => {
    jsonFile.writeFile(fileName, trv, {spaces: 2}, function (err) {
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
 * getTrvById
 * @param {String} trvId - the id (document name) of the trv to be returned
 */
trvStorage.prototype.getTrvById = (trvId) => {
  const fileName = trvId + '.json'
  return new Promise((resolve, reject) => {
    jsonFile.readFile(path.join(trvStoragePath, fileName), function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * getAllTrvs
 */
trvStorage.prototype.getAllTrvs = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(trvStoragePath, function (err, items) {
      if (err) {
        reject(err)
      } else {
        let numOfItems = items.length
        let promises = []
        if (numOfItems > 0) {
          items.forEach((item, index) => {
            promises.push(readJSONFile(path.join(trvStoragePath, item)))
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
 * updateTrv
 * @param {Trv} trv - the trv object to update the current one with
 */
trvStorage.prototype.updateTrv = (trv) => {
  const fileName = path.join(trvStoragePath, (trv.id + '.json'))
  return new Promise((resolve, reject) => {
    jsonFile.writeFile(fileName, trv, {spaces: 2}, function (err) {
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
 * deleteTrv
 * @param {String} trvId  - the id (document name) of the trv to be returned
 */
trvStorage.prototype.deleteTrv = (trvId) => {
  const fileName = trvId + '.json'
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(trvStoragePath, fileName), function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = trvStorage
