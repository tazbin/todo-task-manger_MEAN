const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')

// load in the mongoose models
const { list, task } = require('./db/models')

// load middlewares
app.use(bodyParser.json())

/**route handlers */

/**list routes */

/**
 * get /listes
 * purpose: to get all lists
 */
app.get('/lists', (req, res) => {
    // we want to return an array of all lists in the database
    list.find()
        .then((lists) => {
            res.send(lists)
        })
})

/** 
 * post /lists
 * purpose: create a list
 */
app.post('/lists', (req, res) => {
    // we want to create a new list & restrn the new list with id
    // the list information (fields) will be passed via the req.body
    const title = req.body.title

    const newList = new list({
            title
        })
        .save()
        .then((listDoc) => {
            // full new list is send back including id
            res.send(listDoc)
        })
})

/**
 * patch: /lists/:id
 * purpose: to update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    //we want to update a specified list
    list.findByIdAndUpdate({ _id: req.params.id }, {
            $set: req.body
        })
        .then(() => {
            res.sendStatus(200)
        })
})


/**
 * delete: lists/:id
 * purpose: to delete a specified list
 */
app.delete('/lists/:id', (req, res) => {
    // we want to delere a specified list
    list.findByIdAndDelete({ _id: req.params.id })
        .then((deletedDoc) => {
            res.send(deletedDoc)
        })
})

/**
 * get /lists/:listId/tasks
 * purpose: to get all tasks of a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    task.find({ _listId: req.params.listId })
        .then((tasks) => {
            res.send(tasks)
        })
})

// app.get('/lists/:listId/tasks/:taskId', (req, res) => {
//     task.findOne({
//             _id: req.params.taskId,
//             _listId: req.params.listId
//         })
//         .then((taskDoc) => {
//             res.send(taskDoc)
//         })
// })

/**
 * post /lists/:listId/tasks
 * purpose: to post a new task in a specific list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    const newTask = new task({
            title: req.body.title,
            _listId: req.params.listId
        })
        .save()
        .then((newTaskDoc) => {
            res.send(newTaskDoc)
        })
})

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    task.findOneAndUpdate({
            _id: req.params.taskId,
            _listId: req.params.listId
        }, {
            $set: req.body
        })
        .then(() => {
            res.sendStatus(200)
        })
})

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    task.findOneAndDelete({
            _id: req.params.taskId,
            _listId: req.params.listId
        })
        .then((deleteddDoc) => {
            res.send(deleteddDoc)
        })
})

app.listen(3000, () => {
    console.log('server running on port 3000')
})