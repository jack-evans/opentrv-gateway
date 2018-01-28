'use strict'

/**
 * GET /trv
 * @param {*} req - HTTP Request object
 * @param {*} res - HTTP Response object
 */
const getAllTrvsRequestHandler = (req, res) => {

}

const _getAllTrvs = () => {

}

/**
 * GET /trv/{id}
 * @param {*} req - HTTP Request object
 * @param {*} res - HTTP Response object
 */
const getTrvByIDRequestHandler = (req, res) => {

}

const _getTrvById = () => {

}

/**
 * PUT /trv/{id}
 * @param {*} req - HTTP Request object
 * @param {*} res - HTTP Response object
 */
const updateTrvRequestHandler = (req, res) => {

}

const _updateTrv = () => {

}

/**
 * DELETE /trv/{id}
 * @param {*} req - HTTP Request object
 * @param {*} res - HTTP Response object
 */
const deleteTrvRequestHandler = (req, res) => {

}

const _deleteTrv = () => {

}

module.exports = {
  getAllTrvsRequestHandler: getAllTrvsRequestHandler,
  getTrvByIDRequestHandler: getTrvByIDRequestHandler,
  updateTrvRequestHandler: updateTrvRequestHandler,
  deleteTrvRequestHandler: deleteTrvRequestHandler,
  internal: {
    _getAllTrvs: _getAllTrvs,
    _getTrvById: _getTrvById,
    _updateTrv: _updateTrv,
    _deleteTrv: _deleteTrv
  }
}
