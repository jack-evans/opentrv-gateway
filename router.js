'use strict'

const router = require('express').Router()
const packageJson = require('./package.json')
const trvRequestHandler = require('./lib/trv/trvRequestHandler')

router.post('/trv', trvRequestHandler.createTrvRequestHandler)
router.get('/trv', trvRequestHandler.getAllTrvsRequestHandler)
router.get('/trv/:id', trvRequestHandler.getTrvByIDRequestHandler)
router.put('/trv/:id', trvRequestHandler.updateTrvRequestHandler)
router.delete('trv/:id', trvRequestHandler.deleteTrvRequestHandler)
router.get('/trv/:id/isActive', trvRequestHandler.getTrvActivityRequestHandler)

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router
