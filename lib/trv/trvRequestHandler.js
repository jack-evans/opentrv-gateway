'use strict'

const Promise = require('bluebird')

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
  trvStorage.getAllTrvs(function (err, data) {
    if (err) {
      return Promise.reject(err)
    } else {
      // do some stuff
    }
  })
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

  trvStorage.getTrvById(id, function (err, data) {
    if (err) {
      return Promise.reject(err)
    } else {
      return Promise.resolve(data)
    }
  })
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

  trvStorage.deleteTrv(id, function (err) {
    if (err) {
      return Promise.reject(err)
    } else {
      return Promise.resolve()
    }
  })
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
    _deleteTrv: _deleteTrv
  }
}
