const router = require('express').Router();
const moviesController = require('../controllers/moviesController');

router.get('/', moviesController.isQuery, moviesController.getPopularMovies);
router.get('/categories', moviesController.getCategories);
router.get('/categories/:id', moviesController.getMoviesByCategory);
router.get('/:id', moviesController.getMovieById);
router.get('/:id/related', moviesController.getRelatedMovies);

module.exports = router;