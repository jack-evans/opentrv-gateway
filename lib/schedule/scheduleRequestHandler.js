'use strict'

/**
 * POST /schedule
 *
 * @param {Object} req - the HTTP request object 
 * @param {Object} res - the HTTP response object
 */
const createScheduleRequestHandler = (req, res) => {

}

const _createSchedule = () => {

}

/**
 * GET /schedule
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getAllSchedulesRequestHandler = (req, res) => {

}

const _getAllSchedules = () => {
  
}

/**
 * GET /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const getScheduleByIdRequestHandler = (req, res) => {

}

const _getScheduleById = () => {
  
}

/**
 * PUT  /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const updateScheduleRequestHandler = (req, res) => {

}

const _updateSchedule = () => {
  
}

/**
 * DELETE /schedule/{id}
 *
 * @param {Object} req - the HTTP request object
 * @param {Object} res - the HTTP response object
 */
const deleteScheduleRequestHandler = (req, res) => {

}

const _deleteSchedule = () => {
  
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
