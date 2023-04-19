const mongoose = require('mongoose')
const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://127.0.0.1:27017/whats-in-the-fridge'

mongoose.connect(MONGO_DB_URI)
.then((response) => {
  console.log(`App was connected successfully to database ${MONGO_DB_URI}`)
})
.catch((error) => {
  console.log(`An error ocurred while trying to connect to database ${MONGO_DB_URI}`)
})

process.on("SIGINT", function() {
  mongoose.connection.close( function() {
    console.log(`Mongoose was disconnected on App termination`)
    process.exit(0)
  })
})