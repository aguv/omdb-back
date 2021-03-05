const router = require('express').Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.post('/logout', userController.logOut);
router.post('/login', passport.authenticate('local'), userController.loginUser);
router.post('/register', userController.createUser);
router.get('/', userController.getUser);
router.put('/:id/addfav', userController.addMovieToFavs);
router.post('/deletefavs', userController.removeFromFavs);
router.get('/:email', userController.searchUsers);

module.exports = router;