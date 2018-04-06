'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const TrvStorage = require('./lib/trv/trvStorage')
const trvStorage = new TrvStorage()

const ScheduleStorage = require('./lib/schedule/scheduleStorage')
const scheduleStorage = new ScheduleStorage()

app.use((req, res, next) => {
  req.trvStorage = trvStorage
  req.scheduleStorage = scheduleStorage
  next()
})

const router = require('./router.js')
app.use('/api/v1', router)

module.exports = app
