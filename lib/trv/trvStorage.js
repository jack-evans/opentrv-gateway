'use strict'

const fs = require('fs')
const jsonFile = require('jsonfile')
const path = require('path')

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
trvStorage.prototype.createTrv = (trv, callback) => {
  const fileName = trv.id + '.json'
  jsonFile.writeFile(path.join(trvStoragePath, fileName), trv, {spaces: 2}, function (err) {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
}

/**
 * getTrvById
 * @param {String} trvId - the id (document name) of the trv to be returned
 */
trvStorage.prototype.getTrvById = (trvId, callback) => {
  const fileName = trvId + 'json'
  jsonFile.readFile(path.join(trvStoragePath, fileName), function (err, data) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, data)
    }
  })
}

/**
 * getAllTrvs
 */
trvStorage.prototype.getAllTrvs = (callback) => {
  fs.readdir(trvStoragePath, function (err, items) {
    if (err) {
      callback(err, null)
    } else {
      let result = []
      for (let i = 0; i < items.length; i++) {
        this.getTrvById(items[i], function (err, data) {
          if (err) {
            callback(err, null)
          } else {
            result.push(data)
          }
        })
      }
      callback(null, result)
    }
  })
}

/**
 * updateTrv
 * @param {Trv} trv - the trv object to update the current one with
 */
trvStorage.prototype.updateTrv = (trv, callback) => {
/**
 * TODO
 */
}

/**
 * deleteTrv
 * @param {String} trvId  - the id (document name) of the trv to be returned
 */
trvStorage.prototype.deleteTrv = (trvId, callback) => {
  const fileName = trvId + '.json'
  fs.unlink(path.join(trvStorage, fileName), function (err) {
    if (err) {
      callback(err)
    } else {
      callback()
    }
  })
}

module.exports = trvStorage
