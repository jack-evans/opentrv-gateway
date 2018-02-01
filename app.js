'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.use(bodyParser.json())

const TrvStorage = require('./lib/trv/trvStorage')
const trvStorage = new TrvStorage()

app.use((req, res, next) => {
  req.trvStorage = trvStorage
  next()
})

const router = require('./router.js')
app.use('/api/v1', router)

module.exports = app
