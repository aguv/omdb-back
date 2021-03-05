const axios = require('axios');
const apiKey = '6680c1d71e8424c78c0cbd6a7c901202';

const controller = {};

controller.getPopularMovies = (req, res, next) => {
    let popularMovies = [];
    
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
        .then(res => res.data)
        .then(firstPage => {
            popularMovies = firstPage.results
            return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=2`)
        })
        .then(res => res.data)
        .then(secondPage => {
            popularMovies = [...popularMovies, ...secondPage.results]
            res.status(200).send(popularMovies);
        })
        .catch(next);        
};

controller.getCategories = (req, res, next) => {
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
        .then(res => res.data)
        .then(categories => res.status(200).send(categories.genres))
        .catch(next);
};

controller.getMoviesByCategory = (req, res, next) => {
    const pages = ['page=1', 'page=2', 'page=3', 'page=4'];
    const pagesPromises = pages.map(page => axios.get(`http://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${req.params.id}&${page}`).then(r => r.data))
    let movies = [];

    Promise.all(pagesPromises)
        .then(catMovies => {
            catMovies.map(page => movies = [...movies, ...page.results])
            res.status(200).send(movies);
        })
        .catch(next);
}

controller.getMovieById = (req, res, next) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${apiKey}&language=en-US`)
        .then(res => res.data)
        .then(movie => res.status(200).send(movie))
        .catch(next)
};

controller.isQuery = (req, res, next) => {
    if(req.query.title) {
        let moviesToSend =  [];
        const query = req.query.title.split(' ').join('+')
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
            .then(res => res.data)
            .then(page1 => {
                moviesToSend = page1.results;
                return axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=2`).then(r => r.data);
            })
            .then(page2 => {
                moviesToSend = [...moviesToSend, ...page2.results];
                res.status(200).send(moviesToSend);
            })
            .catch(next);
    } else {
        next();
    }
};

controller.getRelatedMovies = (req, res, next) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/similar?api_key=${apiKey}&language=en-US&page=1`)
        .then(res => res.data)
        .then(movies => res.status(200).send(movies.results.splice(0, 14)))
        .catch(next);
};

module.exports = controller;