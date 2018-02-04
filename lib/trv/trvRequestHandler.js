'use strict'

const Promise = require('bluebird')
const Trv = require('./trv')

let firstTimeCalled = true

/**
 * POST /trv
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const createTrvRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  let trv = req.body.trv
  module.exports.internal._createTrv(trvStorage, trv)
    .then(result => {
      res.status(201).send(result)
    })
    .catch(error => {
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

const _createTrv = (trvStorage, trv) => {
  let error
  if (!trv) {
    error.statusCode = 400
    error.message = 'The trv provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof trv !== 'object') {
    error.statusCode = 400
    error.message = 'The trv provided was not an object'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.createTrv(trv)
}

/**
 * GET /trv
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const getAllTrvsRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  module.exports.internal._getAllTrvs(trvStorage)
    .then(trvs => {
      res.status(200).send(trvs)
    })
    .catch(error => {
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

const _getAllTrvs = (trvStorage) => {
  return trvStorage.getAllTrvs()
}

/**
 * GET /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const getTrvByIDRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvByID(trvStorage, req.params.id)
    .then(trv => {
      res.status(200).send(trv)
    })
    .catch(error => {
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

const _getTrvByID = (trvStorage, id) => {
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

  return trvStorage.getTrvById(id)
}

/**
 * PUT /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const updateTrvRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  module.exports.internal._updateTrv(trvStorage, req.body.trv)
    .then(trv => {
      res.status(200).send(trv)
    })
    .catch(error => {
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

const _updateTrv = (trvStorage, trv) => {
/**
 * TODO
 */
}

/**
 * DELETE /trv/{id}
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const deleteTrvRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  module.exports.internal._deleteTrv(trvStorage, req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
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

const _deleteTrv = (trvStorage, id) => {
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

  return trvStorage.deleteTrv(id)
}

/**
 * _roundToOneDP method
 *
 * Rounds the value passed in to 1 decimal place
 * @param number - the number to be rounded
 * @returns {number} a number with 1 decimal place
 * @private
 */
const _roundToOneDP = (number) => {
  return Math.round(number * 10) / 10
}

module.exports = {
  getAllTrvsRequestHandler: getAllTrvsRequestHandler,
  getTrvByIDRequestHandler: getTrvByIDRequestHandler,
  updateTrvRequestHandler: updateTrvRequestHandler,
  deleteTrvRequestHandler: deleteTrvRequestHandler,
  internal: {
    _getAllTrvs: _getAllTrvs,
    _getTrvByID: _getTrvByID,
    _updateTrv: _updateTrv,
    _deleteTrv: _deleteTrv,
    _roundToOneDP: _roundToOneDP
  }
}
