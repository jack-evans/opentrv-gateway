const activityChecker = require('./lib/activityChecker/activityChecker')
const cronTask = require('node-cron')


cronTask.schedule('* * * * * *', function () {
  activityChecker.startActivityChecker()
})
