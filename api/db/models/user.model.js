const mongoose = require('mongoose')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// jwt secret
jwtAccessSecret = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    sessions: [{
        token: {
            type: String,
            require: true
        },
        expiresAt: {
            type: Number,
            require: true
        }
    }]
})

//** instance methods */

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    // return the doc except the password & sessions
    return _.omit(userObject, ['password', 'sessions'])
}

userSchema.methods.generateAccessAuthToken = function() {

    const user = this;
    return new Promise((resolve, reject) => {
        // Create the JSON Web Token and return that
        jwt.sign({ _id: user._id.toHexString() }, jwtAccessSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                // there is an error
                reject();
            }
        })
    })

}

userSchema.methods.generateRefreshAuthToken = function() {
    // this method generate refresh token, it does not save it to database, saveSessionToDatabase() does that
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                // no error
                let token = buf.toString('hex');

                return resolve(token);
            }
        })
    })
}

userSchema.methods.createSession = function() {
    let user = this
    return user.generateRefreshAuthToken().then((refreshToken) => {
            return saveSessionToDatabse(user, refreshToken)
        })
        .then((refreshToken) => {
            // saved to databse successfully
            // now return the refresh token
            return refreshToken
        })
        .catch((e) => {
            return Promise.reject('Failed to save sassion to database. \n', e)
        })
}

/** MODEL METHODS */
userSchema.statics.findByIdAndToken = function(_id, token) {
    const User = this

    return User.findOne({
        _id,
        'sessions.token': token
    })
}

userSchema.statics.findByCredentials = function(email, password) {
    const user = this

    return user.findOne({ email, password })
}

userSchema.statics.hasRefreshTokenExpires = (expiresAt) => {
    const secondSinceEpoch = Date.now() / 1000

    if (expiresAt > secondSinceEpoch) {
        // hasn't expired
        return false
    } else {
        // has expired
        return true
    }

}

/** HELPER METHODS */

let saveSessionToDatabse = (user, refreshToken) => {
    //  save sessionto database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime()

        user.sessions.push({
            'token': refreshToken,
            expiresAt
        })

        user
            .save()
            .then(() => {
                // saved session successfully
                return resolve(refreshToken)
            })
            .catch((e) => {
                reject(e)
            })
    })


    // return new Promise((resolve, reject) => {
    //     let expiresAt = generateRefreshTokenExpiryTime();

    //     user.sessions.push({ 'token': refreshToken, expiresAt });

    //     user.save().then(() => {
    //         // saved session successfully
    //         return resolve(refreshToken);
    //     }).catch((e) => {
    //         reject(e);
    //     });
    // })
}

let generateRefreshTokenExpiryTime = () => {
    const daysUntilExpires = "10"
    const secondsUntilExpires = ((daysUntilExpires * 24) * 60) * 60
    return ((Date.now() / 1000) + secondsUntilExpires)
}

const User = mongoose.model('User', userSchema)

module.exports = { User }