'use strict'

const router = require('express').Router()
const packageJson = require('./package.json')

router.get('/test', (req, res) => {
  res.status(200).send({'time': new Date(), 'name': packageJson.name, 'version': packageJson.version})
})

module.exports = router
