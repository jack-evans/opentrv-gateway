const cronTask = require('node-cron')

cronTask.schedule('* * * * * *', function () {
  console.log('running task every second', new Date())
})
