var checkAuth = require("./../middleware/checkAuth.js")
const getGames = require('../middleware/getGames.js');
const getMax = require('./../middleware/getMax.js');
const express = require('express');
const router = express.Router();

// Отчеты

router.get('/reports', checkAuth, getGames, getMax, (req, res) => {
    res.render('reports', { title: 'Отчеты', games: req.games, lowStockgames: req.lowStockgames, user: req.session.user });
});
module.exports = router;