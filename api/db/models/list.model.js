const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

const list = mongoose.model('list', listSchema)

module.exports = { list }