const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')

// load in the mongoose models
const { list, task, User } = require('./db/models')

// load middlewares
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
})

let verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.header('x-refresh-token')
    const _id = req.header('_id')

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found'
            })
        }

        // if the user is found
        req.user_id = user._id
        req.refreshToken = refreshToken
        req.userObject = user

        let isSessionValid = false

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpires(session.expiresAt) === false) {
                    isSessionValid = true
                }
            }
        })

        if (isSessionValid) {
            next()
        } else {
            return Promise.reject({
                'error': 'Refresh token has expires or session is invalid'
            })
        }


    }).catch((e) => {
        res.status(401).send(e)
    })

}

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
            res.status(200).send("complete toggled")
        })
        .catch((err) => {
            res.status(500).send("error occured")
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

/** --------- USER ROUTES ----------- */

/** signup */
app.post('/users', (req, res) => {
    const body = req.body
    const newUser = new User(body)

    newUser.save().then(() => {
        return newUser.createSession()
    }).then((refreshToken) => {

        return newUser.generateRefreshAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        })
    }).then((authToken) => {
        res
            .header('x-refresh-token', authToken.refreshToken)
            .header('x-access-token', authToken.accessToken)
            .send(newUser)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

/** login */
app.post('/users/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            })
        }).then((authToken) => {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(user)
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

/** get new accesstoken */
app.get('/users/me/accesstoken', verifyRefreshToken, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-toekn', accessToken).send(accessToken)
    }).catch((e) => {
        res.status(401).send(e)
    })
})

app.listen(3000, () => {
    console.log('server running on port 3000')
})