const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const controller = {};

controller.createUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) res.send(400).send('User already exists');
            else {
                bcrypt.hash(req.body.password, 10)
                    .then(hashed => {
                        const newUser = new User({ email: req.body.email, password: hashed });
                        return newUser.save();
                    })
                    .then(user => res.status(201).send(user))
            }
        })
        .catch(next);
};

controller.loginUser = (req, res, next) => {
    res.status(200).send(req.user);
};

controller.getUser = (req, res, next) => {
    if(req.isAuthenticated()) res.send(req.user);
    else {
        res.sendStatus(401);
    }
};

controller.addMovieToFavs = (req, res, next) => {
    User.updateOne(
        { _id: req.params.id },
        { $addToSet: {favoritesMovies: req.body} }
    )
        .then(() => res.status(201).send({id: `${req.body.id}`, poster_path: req.body.poster_path}))
        .catch(next)
};

controller.removeFromFavs = (req, res, next) => {
   User.updateOne(
       {_id: req.body.userId},
       { $pull: {favoritesMovies: { id: req.body.movieId } } } 
    )  
        .then(() => res.status(201).send(req.body.movieId))
        .catch(next)
}

controller.logOut = (req, res, next) => {
    req.session.destroy((err) => {
        if(err) return next(err)
        req.logout()
        res.sendStatus(200)
    })
}

controller.searchUsers = (req, res, next) => {
    User.find({ email: {'$regex': req.params.email} })
        .then(users => res.status(200).send(users))
        .catch(next);
}

module.exports = controller;