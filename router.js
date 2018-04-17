'use strict'

const router = require('express').Router()
const packageJson = require('./package.json')
const scheduleRequestHandler = require('./lib/schedule/scheduleRequestHandler')
const trvRequestHandler = require('./lib/trv/trvRequestHandler')

// trv request handlers
router.post('/trv', trvRequestHandler.createTrvRequestHandler)
router.get('/trv', trvRequestHandler.getAllTrvsRequestHandler)
router.get('/trv/:id', trvRequestHandler.getTrvByIDRequestHandler)
router.put('/trv/:id', trvRequestHandler.updateTrvRequestHandler)
router.delete('/trv/:id', trvRequestHandler.deleteTrvRequestHandler)
router.get('/trv/:id/isActive', trvRequestHandler.getTrvActivityRequestHandler)
router.get('/trv/:id/temperature', trvRequestHandler.getTrvTemperatureRequestHandler)
router.put('/trv/:id/temperature', trvRequestHandler.updateTrvTargetTemperatureRequestHandler)
router.get('/trv/:id/info', trvRequestHandler.getTrvInfoRequestHandler)

// schedule request handlers
router.post('/schedule', scheduleRequestHandler.createScheduleRequestHandler)
router.get('/schedule', scheduleRequestHandler.getAllSchedulesRequestHandler)
router.get('/schedule/:id', scheduleRequestHandler.getScheduleByIdRequestHandler)
router.put('/schedule/:id', scheduleRequestHandler.updateScheduleRequestHandler)
router.delete('/schedule/:id', scheduleRequestHandler.deleteScheduleRequestHandler)

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router
