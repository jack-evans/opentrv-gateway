'use strict'

const app = require('./app')
const SERVER_PORT = process.env.SERVER_PORT || 3002
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.listen(SERVER_PORT, () => {
    console.log(`server listening on port ${SERVER_PORT}`)
  })

  console.log(`Worker ${process.pid} started`);
}

