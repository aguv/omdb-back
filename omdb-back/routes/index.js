const router = require('express').Router();
const moviesRoutes = require('./moviesRoutes');
const usersRoutes = require('./usersRoutes');

router.use('/movies', moviesRoutes);
router.use('/users', usersRoutes);

module.exports = router;