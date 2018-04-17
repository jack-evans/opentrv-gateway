'use strict'

const bunyan = require('bunyan')
const logging = require('../utils/logging.js')
const Promise = require('bluebird')
const Trv = require('./trv')
const trvSchema = require('./trvSchema')
const Validator = require('jsonschema').Validator

const logger = bunyan.createLogger({name: 'trv-request-handler', serializers: bunyan.stdSerializers})
const validator = new Validator()

/**
 * POST /trv
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const createTrvRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'createTrvRequestHandler', false, {body: req.body})
  let trvStorage = req.trvStorage
  let trv = req.body
  module.exports.internal._createTrv(trvStorage, trv)
    .then(result => {
      logger.info('Successfully created a new trv', result)
      res.status(201).send(result)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'createTrvRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 409: {
          res.status(409).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _createTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} trv - the trv details to store
 */
const _createTrv = (trvStorage, trv) => {
  logging.logFunctionEntry(logger, '_createTrv', true, {trv: trv})
  let error = {}
  if (!trv) {
    error.statusCode = 400
    error.message = 'The body provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof trv !== 'object') {
    error.statusCode = 400
    error.message = 'The body provided was not an object. It was of the type ' + typeof trv
    error.name = 'bad request'
    return Promise.reject(error)
  }

  let trvObject = new Trv(trv.currentTemperature, trv.targetTemperature, trv.ambientTemperature, trv.name)
  let result = validator.validate(trvObject, trvSchema)

  if (result.errors.length > 0) {
    error.statusCode = 400
    error.message = 'The trv object does not match the required schema'
    error.detail = result.errors
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.createTrv(trvObject)
}

/**
 * GET /trv
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const getAllTrvsRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getAllTrvsRequestHandler', false, undefined)
  let trvStorage = req.trvStorage
  module.exports.internal._getAllTrvs(trvStorage)
    .then(trvs => {
      trvs.sort(function (a, b) {
        return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)
      })
      logger.info('Succesfully found the following trvs', trvs)
      res.status(200).send(trvs)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getAllTrvsRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _getAllTrvs
 * @param {Object} trvStorage - the storage medium for the trvs
 */
const _getAllTrvs = (trvStorage) => {
  logging.logFunctionEntry(logger, '_getAllTrvs', true, undefined)
  return trvStorage.getAllTrvs()
}

/**
 * GET /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const getTrvByIDRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getTrvByIDRequestHandler', false, {id: req.params.id})
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvByID(trvStorage, req.params.id)
    .then(trv => {
      logger.info('Successfully found the following trv', trv)
      res.status(200).send(trv)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getTrvByIDRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _getTrvByID
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {String} id - the id of the desired trv
 */
const _getTrvByID = (trvStorage, id) => {
  logging.logFunctionEntry(logger, '_getTrvByID', false, {id: id})
  let error = {}
  if (!id) {
    error.statusCode = 400
    error.message = 'The id provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof id !== 'string') {
    error.statusCode = 400
    error.message = 'The id provided was not in string format'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  // check uuid in following format [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
  let regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

  if (!regex.test(id)) {
    error.statusCode = 400
    error.message = 'Id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.getTrvById(id)
}

/**
 * PUT /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const updateTrvRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'updateTrvRequestHandler', false, {body: req.body})
  let trvStorage = req.trvStorage

  module.exports.internal._getTrvByID(trvStorage, req.params.id)
    .then(oldTrv => {
      logger.info('Successfully retrieved old trv ', oldTrv)
      return module.exports.internal._updateTrv(trvStorage, oldTrv, req.body)
    })
    .then(newTrv => {
      logger.info('Successfully updated the trv properties ', newTrv)
      res.status(200).send(newTrv)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'updateTrvRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        case 409: {
          res.status(409).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _updateTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} oldTrv - the old trv to update
 * @param {Object} newTrv - the new trv object to update with
 */
const _updateTrv = (trvStorage, oldTrv, newTrv) => {
  logging.logFunctionEntry(logger, '_updateTrv', true, {trv: newTrv})
  let error = {}
  if (!newTrv) {
    error.statusCode = 400
    error.message = 'The trv provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof newTrv !== 'object') {
    error.statusCode = 400
    error.message = 'The trv provided was not an object'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  const trv = Object.assign(oldTrv, newTrv)
  let result = validator.validate(trv, trvSchema)

  if (result.errors.length > 0) {
    error.statusCode = 400
    error.message = 'The trv object does not match the required schema'
    error.detail = result.errors
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.updateTrv(trv)
}

/**
 * DELETE /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const deleteTrvRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'deleteTrvRequestHandler', false, {id: req.params.id})
  let trvStorage = req.trvStorage
  module.exports.internal._deleteTrv(trvStorage, req.params.id)
    .then(() => {
      logger.info('Successfully deleted the trv')
      res.status(204).send({})
    })
    .catch(error => {
      logging.logErrorCase(logger, 'deleteTrvRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * _deleteTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} id - the id of the particular trv to delete
 */
const _deleteTrv = (trvStorage, id) => {
  logging.logFunctionEntry(logger, '_deleteTrv', true, {id: id})
  let error = {}
  if (!id) {
    error.statusCode = 400
    error.message = 'The id provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof id !== 'string') {
    error.statusCode = 400
    error.message = 'The id provided was not in string format'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  // check uuid in following format [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
  let regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

  if (!regex.test(id)) {
    error.statusCode = 400
    error.message = 'Id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.deleteTrv(id)
}

/**
 * GET /trv/{id}/isActive
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const getTrvActivityRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getTrvActivityRequestHandler', false, {id: req.params.id})
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvByID(trvStorage, req.params.id)
    .then(trv => {
      let activity = trv.active
      logger.info('Successsfully retrieved the activity for ' + req.params.id, {active: activity})
      res.status(200).send({active: activity})
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getTrvActivityRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

/**
 * GET /trv/{id}/temperature
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const getTrvTemperatureRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getTrvTemperatureRequestHandler', false, {id: req.params.id})
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvByID(trvStorage, req.params.id)
    .then(trv => {
      let temperature = trv.currentTemperature
      logger.info('Successfully retrieved the current temperature for ' + req.params.id, {currentTemperature: temperature})
      res.status(200).send({currentTemperature: temperature})
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getTrvTemperatureRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

const updateTrvTargetTemperatureRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'updateTrvTargetTemperatureRequestHandler', false, {id: req.params.id, targetTemperature: req.body.targetTemperature})
  module.exports.internal._getTrvByID(req.trvStorage, req.params.id)
    .then(oldTrv => {
      let trv = JSON.parse(JSON.stringify(oldTrv))
      trv.targetTemperature = req.body.targetTemperature
      return module.exports.internal._updateTrv(req.trvStorage, oldTrv, trv)
    })
    .then(result => {
      logger.info('Successfully updated the target temperature for ' + req.params.id)
      res.status(200).send(result)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'updateTrvTargetTemperatureRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        case 409: {
          res.status(409).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

const getTrvInfoRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getTrvInfoRequestHandler', false, {id: req.params.id})
  module.exports.internal._getTrvByID(req.trvStorage, req.params.id)
    .then(trv => {
      const info = {
        id: trv.id,
        currentTemperature: trv.currentTemperature,
        targetTemperature: trv.targetTemperature,
        active: trv.active,
        timeStamp: new Date()
      }
      logger.info('Successfully retrieved the information for ' + req.params.id, info)
      res.status(200).send(info)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getTrvInfoRequestHandler', error)
      switch (error.statusCode) {
        case 400: {
          res.status(400).send(error)
          break
        }

        case 404: {
          res.status(404).send(error)
          break
        }

        default: {
          res.status(500).send(error)
          break
        }
      }
    })
}

module.exports = {
  createTrvRequestHandler: createTrvRequestHandler,
  getAllTrvsRequestHandler: getAllTrvsRequestHandler,
  getTrvByIDRequestHandler: getTrvByIDRequestHandler,
  updateTrvRequestHandler: updateTrvRequestHandler,
  deleteTrvRequestHandler: deleteTrvRequestHandler,
  getTrvActivityRequestHandler: getTrvActivityRequestHandler,
  getTrvTemperatureRequestHandler: getTrvTemperatureRequestHandler,
  updateTrvTargetTemperatureRequestHandler: updateTrvTargetTemperatureRequestHandler,
  getTrvInfoRequestHandler: getTrvInfoRequestHandler
}

module.exports.internal = {
  _createTrv: _createTrv,
  _getAllTrvs: _getAllTrvs,
  _getTrvByID: _getTrvByID,
  _updateTrv: _updateTrv,
  _deleteTrv: _deleteTrv
}
