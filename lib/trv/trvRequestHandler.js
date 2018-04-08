'use strict'

const Promise = require('bluebird')
const Trv = require('./trv')

/**
 * POST /trv
 * @param {Object} req - HTTP Request object
 * @param {Object} res - HTTP Response object
 */
const createTrvRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  let trv = req.body
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

/**
 * _createTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} trv - the trv details to store
 */
const _createTrv = (trvStorage, trv) => {
  let error = {}
  if (!trv) {
    error.statusCode = 400
    error.message = 'The body provided was undefined'
    error.name = 'bad request'
    return Promise.reject(error)
  }

  if (typeof trv !== 'object') {
    error.statusCode = 400
    error.message = 'The body provided was not an object... It was of the type ' + typeof trv
    error.name = 'bad request'
    return Promise.reject(error)
  }

  let trvObject = new Trv(trv.currentTemperature, null, 18, trv.name)

  return trvStorage.createTrv(trvObject)
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
      trvs.sort(function (a, b) {
        return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)
      })

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

/**
 * _getAllTrvs
 * @param {Object} trvStorage - the storage medium for the trvs
 */
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

/**
 * _getTrvByID
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {String} id - the id of the desired trv
 */
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
  let trvStorage = req.trvStorage
  module.exports.internal._updateTrv(trvStorage, req.body)
    .then(() => {
      return module.exports.internal._getTrvByID(trvStorage, req.params.id)
    })
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

/**
 * _updateTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} trv - the updated trv object
 */
const _updateTrv = (trvStorage, trv) => {
  let error = {}
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

  return trvStorage.updateTrv(trv)
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

/**
 * _deleteTrv
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} id - the id of the particular trv to delete
 */
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

  // check uuid in following format [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
  let regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

  if (!regex.test(id)) {
    error.statusCode = 400
    error.message = 'the id did not match the following regex: ' + regex
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
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvActivity(trvStorage, req.params.id)
    .then(activity => {
      res.status(200).send({active: activity})
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

/**
 * _getTrvActivity
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} id - the id of the particular trv to retrieve the activity for
 */
const _getTrvActivity = (trvStorage, id) => {
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
    error.message = 'the id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.getTrvById(id)
    .then(trv => {
      return Promise.resolve(trv.active)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/**
 * GET /trv/{id}/temperature
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const getTrvTemperatureRequestHandler = (req, res) => {
  let trvStorage = req.trvStorage
  module.exports.internal._getTrvTemperature(trvStorage, req.params.id)
    .then(temperature => {
      res.status(200).send({currentTemperature: temperature})
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

/**
 * _getTrvTemperature
 * @param {Object} trvStorage - the storage medium for the trvs
 * @param {Object} id - the id of the particular trv to retrieve the temperature for
 */
const _getTrvTemperature = (trvStorage, id) => {
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
    error.message = 'the id did not match the following regex: ' + regex
    error.name = 'bad request'
    return Promise.reject(error)
  }

  return trvStorage.getTrvById(id)
    .then(trv => {
      return Promise.resolve(trv.currentTemperature)
    })
    .catch(error => {
      return Promise.reject(error)
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
  internal: {
    _createTrv: _createTrv,
    _getAllTrvs: _getAllTrvs,
    _getTrvByID: _getTrvByID,
    _updateTrv: _updateTrv,
    _deleteTrv: _deleteTrv,
    _getTrvActivity: _getTrvActivity,
    _getTrvTemperature: _getTrvTemperature
  }
}
