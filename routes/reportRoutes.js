const checkAuth = require("./../middleware/checkAuth.js");
const getGames = require('../middleware/getGames.js');
const getMax = require('./../middleware/getMax.js');
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const db = require('../mySQLConnect.js');

// Маршрут для страницы отчетов
router.get('/reports', checkAuth, getGames, getMax, (req, res) => {
    res.render('reports', { title: 'Отчеты', games: req.games, lowStockgames: req.lowStockgames, user: req.session.user });
});

// Маршрут для дашборда
router.get('/dashboard', checkAuth, (req, res, next) => {
    // Путь к JSON-файлу
    const dataPath = path.join(__dirname, '../data/ordersData.json');

    // Загрузка данных из JSON-файла
    fs.readJson(dataPath, (err, data) => {
        if (err) return next(err);

        // Подсчет самых продаваемых игр
        const gameSalesCount = data.orderGames.reduce((acc, game) => {
            acc[game.games_id] = (acc[game.games_id] || 0) + 1;
            return acc;
        }, {});

        // Формируем массив топ-5 игр
        const topGamesIds = Object.entries(gameSalesCount)
            .map(([games_id, total_sales]) => ({ games_id, total_sales }))
            .sort((a, b) => b.total_sales - a.total_sales)
            .slice(0, 5);

        // Получаем названия игр из таблицы `games`
        const gameIds = topGamesIds.map(game => game.games_id);
        db.query(
            `SELECT id, title FROM games WHERE id IN (?)`,
            [gameIds],
            (err, gameTitles) => {
                if (err) return next(err);

                // Добавляем названия к объектам топ-игр
                const topGames = topGamesIds.map(game => {
                    // Ищем название игры по её ID
                    const foundGame = gameTitles.find(titleObj => titleObj.id == game.games_id);
                    return {
                        ...game,
                        title: foundGame ? foundGame.title : 'Название не найдено' // Если не нашли, то используем текст по умолчанию
                    };
                });

                // Рендеринг шаблона dashboard.ejs с данными
                res.render('dashboard', {
                    title: 'Дашборд',
                    orders: data.orders,
                    orderGames: data.orderGames,
                    topGames,
                    user: req.session.user
                });
            }
        );
    });
});

module.exports = router;
