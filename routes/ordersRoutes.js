const express = require('express');
const router = express.Router();
const db = require('../mySQLConnect.js');

// Маршрут для отображения страницы заказов
router.get('/orders_page', function (req, res, next) {
    const user = req.session.user; // Получаем информацию о пользователе

    // Проверяем, есть ли пользователь в сессии
    if (!user) {
        return res.redirect('/logreg'); // Если нет, перенаправляем на страницу входа
    }


    // Запрос для получения всех заказов
    db.query('SELECT * FROM orders', (err, orders) => {
        if (err) {
            console.error('Ошибка при получении заказов:', err);
            return next(err); // Обработка ошибки
        }

        // Отправляем данные в представление
        res.render('orders_page', { title: 'Заказы', orders, error: null, user });
    });
});

module.exports = router;
