const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    register: {
        type: Date,
        default: Date.now()
    },
    favoritesMovies: [
        {
            poster_path: String,
            id: String
        }
    ]
})

module.exports = mongoose.model('User', userSchema)