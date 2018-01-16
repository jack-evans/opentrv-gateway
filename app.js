'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const app = express()

app.use(bodyParser.json())

const router = require('./router.js')
app.use('/api/v1', router)

module.exports = app
