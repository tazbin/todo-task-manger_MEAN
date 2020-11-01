// this file will handle mongoDB connection logic to the mongoDB databse

const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/taskManager', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to mongoDB successfully...')
    })
    .catch((e) => {
        console.log('Error while attemptin to connect to MongoDB')
        console.log(e)
    })

// to prevent deprecation warnings
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

module.exports = {
    mongoose
}