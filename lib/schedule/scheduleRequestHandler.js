'use strict'

const bunyan = require('bunyan')
const logging = require('../utils/logging.js')
const request = require('request-promise')
const Schedule = require('./Schedule.js')
const scheduleSchema = require('./scheduleSchema.js')
const Validator = require('jsonschema').Validator

const logger = bunyan.createLogger({name: 'trv-request-handler', serializers: bunyan.stdSerializers})
const validator = new Validator()

/**
 * POST /schedule
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const createScheduleRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'createScheduleRequestHandler', false, req.body)
  module.exports.internal._createSchedule(req.scheduleStorage, req.body)
    .then(result => {
      logger.info('Successfully created a new schedule', result)
      res.status(201).send(result)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'createScheduleRequestHandler', error)
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
 * _createSchedule internal function
 *
 * @param  {Object} scheduleStorage  the storage medium for the schedules
 * @param  {Object} schedule         the JSON document of the schedule to be stored
 * @return {Promise}                 on the action of storing the schedule document
 * @private
 */
const _createSchedule = (scheduleStorage, schedule) => {
  logging.logFunctionEntry(logger, '_createSchedule', true, schedule)

  let error = {}
  if (!schedule) {
    error.statusCode = 400
    error.message = 'The body provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof schedule !== 'object') {
    error.statusCode = 400
    error.message = 'The body provided was not an object... It was of the type ' + typeof schedule
    error.name = 'bad request'
    return Promise.reject(error)
  }

  let scheduleObject = new Schedule(schedule.name, schedule.targetTemperature, schedule.startTime, schedule.endTime, schedule.trvsAppliedOn)
  let result = validator.validate(scheduleObject, scheduleSchema)

  if (result.errors.length > 0) {
    error.statusCode = 400
    error.message = 'The schedule object does not match the required schema'
    error.detail = result.errors
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return scheduleStorage.createSchedule(scheduleObject)
    .then(scheduleDocument => {
      let numberOfTrvs = scheduleDocument.trvsAppliedOn.length
      let promiseArray = []
      for (let i = 0; i < numberOfTrvs; i++) {
        let options = {
          url: 'http://localhost:3002/api/v1/trv/' + scheduleDocument.trvsAppliedOn[i] + '/activeSchedules',
          method: 'PATCH',
          json: {
            operation: 'add',
            scheduleId: scheduleDocument.id
          }
        }
        promiseArray.push(request(options))
      }

      return Promise.all(promiseArray).then(() => Promise.resolve(scheduleDocument))
    })
}

/**
 * GET /schedule
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getAllSchedulesRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getAllSchedulesRequestHandler', false, undefined)
  module.exports.internal._getAllSchedules(req.scheduleStorage)
    .then(schedules => {
      schedules.sort(function (a, b) {
        return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)
      })
      logger.info('Succesfully found the following schedules', schedules)
      res.status(200).send(schedules)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getAllSchedulesRequestHandler', error)
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
 * _getAllSchedules internal function
 * @param  {Object} scheduleStorage the storage medium for the schedules
 * @return {Promise}                on the action of retrieveing all schedule documents
 * @private
 */
const _getAllSchedules = (scheduleStorage) => {
  logging.logFunctionEntry(logger, '_getAllSchedules', true, undefined)
  return scheduleStorage.getAllSchedules()
}

/**
 * GET /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getScheduleByIdRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'getScheduleByIdRequestHandler', false, req.params.id)
  module.exports.internal._getScheduleById(req.scheduleStorage, req.params.id)
    .then(schedule => {
      logger.info('Successfully found the following schedule', schedule)
      res.status(200).send(schedule)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'getScheduleByIdRequestHandler', error)
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
 * getScheduleById internal function
 * @param  {Object} scheduleStorage the storage medium for the schedules
 * @param  {String} id              the id of the schedule to retrieve
 * @return {Promise}                on the action of retrieving a schedule document
 * @private
 */
const _getScheduleById = (scheduleStorage, id) => {
  logging.logFunctionEntry(logger, '_getScheduleById', true, {id: id})
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

  return scheduleStorage.getScheduleById(id)
}

/**
 * PUT  /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const updateScheduleRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'updateScheduleRequestHandler', false, req.body)

  module.exports.internal._getScheduleById(req.scheduleStorage, req.params.id)
    .then(oldSchedule => {
      logger.info('Successfully retrieved current schedule from storage: ', oldSchedule)
      return module.exports.internal._updateSchedule(req.scheduleStorage, oldSchedule, req.body)
    })
    .then(newSchedule => {
      logger.info('Successfully updated the schedule to: ', newSchedule)
      res.status(200).send(newSchedule)
    })
    .catch(error => {
      logging.logErrorCase(logger, 'updateScheduleRequestHandler', error)
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
 * _updateSchedule internal function
 * @param  {Object} scheduleStorage     the storage medium for the schedules
 * @param  {Object} oldScheduleDocument the old schedule document to update
 * @param  {Object} newScheduleDocument the new schedule document to update with
 * @return {Promise}                    on the action of updating the document
 */
const _updateSchedule = (scheduleStorage, oldScheduleDocument, newScheduleDocument) => {
  logging.logFunctionEntry(logger, '_updateSchedule', true, newScheduleDocument)

  let error = {}
  if (!newScheduleDocument) {
    error.statusCode = 400
    error.message = 'The schedule provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof newScheduleDocument !== 'object') {
    error.statusCode = 400
    error.message = 'The schedule provided was not an object'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  const schedule = Object.assign(oldScheduleDocument, newScheduleDocument)
  let result = validator.validate(schedule, scheduleSchema)

  if (result.errors.length > 0) {
    error.statusCode = 400
    error.message = 'The schedule object does not match the required schema'
    error.detail = result.errors
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return scheduleStorage.updateSchedule(schedule)
}

/**
 * DELETE /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const deleteScheduleRequestHandler = (req, res) => {
  logging.logFunctionEntry(logger, 'deleteScheduleRequestHandler', false, req.params.id)
  module.exports.internal._deleteSchedule(req.scheduleStorage, req.params.id)
    .then(() => {
      logger.info('Successfully deleted schedule: ', req.params.id)
      res.status(204).send({})
    })
    .catch(error => {
      logging.logErrorCase(logger, 'deleteScheduleRequestHandler', error)
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
 * _deleteSchedule internal function
 * @param  {Object} scheduleStorage the storage medium for the schedules
 * @param  {String} id              the id of the schedule to delete
 * @return {Promise}                on the action of deleteing a schedule
 */
const _deleteSchedule = (scheduleStorage, id) => {
  logging.logFunctionEntry(logger, '_deleteSchedule', true, {id: id})
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

  return scheduleStorage.deleteSchedule(id)
}

module.exports = {
  createScheduleRequestHandler: createScheduleRequestHandler,
  getAllSchedulesRequestHandler: getAllSchedulesRequestHandler,
  getScheduleByIdRequestHandler: getScheduleByIdRequestHandler,
  updateScheduleRequestHandler: updateScheduleRequestHandler,
  deleteScheduleRequestHandler: deleteScheduleRequestHandler,
  internal: {
    _createSchedule: _createSchedule,
    _getAllSchedules: _getAllSchedules,
    _getScheduleById: _getScheduleById,
    _updateSchedule: _updateSchedule,
    _deleteSchedule: _deleteSchedule
  }
}
