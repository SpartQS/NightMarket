var checkAuth = require("./../middleware/checkAuth.js")
const express = require('express');
const router = express.Router();
const db = require('../mySQLConnect.js');

// Корзина

router.get('/cart', checkAuth, function (req, res, next) {
    const userId = req.session.user.id;
    // Получаем данные о товарах в корзине пользователя из таблицы basket
    db.query(`SELECT * FROM basket WHERE user_id = ${userId}`, (err, orderResults) => {
        if (err) {
            return next(err);
        }

        // Объявляем переменные для общей цены и общего количества товаров
        let totalPrice = 0;
        let totalQuantity = 0;

        // Получаем данные о каждом товаре из таблицы games
        const promises = orderResults.map(order => {
            return new Promise((resolve, reject) => {
                db.query(`SELECT * FROM games WHERE id = ${order.games_id}`, (err, gameResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        const game = gameResults[0];
                        const { title, description, price, images } = game;
                        // Добавляем информацию о товаре к объекту заказа
                        order.title = title;
                        order.description = description;
                        order.price = price;
                        order.images = images;
                        totalPrice += price * order.quantity;
                        totalQuantity += parseInt(order.quantity);
                        resolve(order);
                    }
                });
            });
        });


        // Ждем завершения всех запросов к базе данных
        Promise.all(promises)
            .then(basket => {
                // Передаем данные о товарах в корзине в шаблон для отображения
                res.render('cart', { title: 'Корзина', basket, totalPrice, totalQuantity, user: req.session.user });
            })
            .catch(err => {
                next(err);
            });
    });
});


router.post('/cart', async (req, res, next) => {
    try {
        const gameId = req.body.gameId;
        const userId = req.session.user.id;

        // Проверяем, авторизован ли пользователь
        if (!userId) {
            return res.redirect('/logreg');
        }

        // Получаем данные об игре
        db.query(`SELECT * FROM games WHERE id = ?`, [gameId], (err, gameResults) => {
            if (err) return next(err);

            if (gameResults.length > 0) {
                const game = gameResults[0];
                const { all_games } = game;

                // Проверяем, находится ли товар уже в корзине
                db.query(`SELECT * FROM basket WHERE user_id = ? AND games_id = ?`, [userId, gameId], (err, results) => {
                    if (err) return next(err);

                    if (results.length > 0) {
                        // Товар уже в корзине
                        res.redirect('/?message=Товар уже добавлен в корзину');
                    } else {
                        // Товара нет в корзине, добавляем новый
                        if (all_games > 0) { // Проверяем наличие товара на складе
                            db.query(`INSERT INTO basket (user_id, games_id, quantity) VALUES (?, ?, ?)`, [userId, gameId, 1], (err, insertResult) => {
                                if (err) return next(err);
                                res.redirect('/?message=Товар добавлен в корзину');
                            });
                        } else {
                            res.render('index', { title: 'Главная', games: gameResults, errorMessage: 'Товар закончился', user: req.session.user });
                        }
                    }
                });
            } else {
                res.status(404).send('Товар не найден');
            }
        });
    } catch (err) {
        next(err);
    }
});




// Удаление из корзины

router.post('/remove-item', checkAuth, (req, res, next) => {
    const orderId = req.body.orderId;

    db.query(`DELETE FROM basket WHERE id = ${orderId}`, (err, result) => {
        if (err) {
            return next(err);
        }
        res.redirect('/cart');
    });
});


// Очистить все из корзины

router.post('/clear-cart', checkAuth, (req, res, next) => {
    const userId = req.session.user.id;

    db.query(`DELETE FROM basket WHERE user_id = ${userId}`, (err, result) => {
        if (err) {
            return next(err);
        }
        res.redirect('/cart');
    });
});

// Покупка товаров из корзины

// Покупка товаров из корзины
router.post('/buy-cart', async (req, res, next) => {
    const userId = req.session.user.id;

    // Проверка авторизации
    if (!userId) {
        return res.redirect('/logreg');
    }

    try {
        // Получаем товары из корзины пользователя
        const [basketItems] = await db.promise().query('SELECT * FROM basket WHERE user_id = ?', [userId]);

        if (basketItems.length === 0) {
            console.log('Корзина пуста.');
            return res.redirect('/cart');
        }

        const orderPromises = basketItems.map(async (item) => {
            const [gameResults] = await db.promise().query('SELECT * FROM games WHERE id = ?', [item.games_id]);
            const game = gameResults[0];

            if (!game) {
                throw new Error(`Товар с ID ${item.games_id} не найден.`);
            }

            const totalAmount = game.price * item.quantity; // Общая стоимость
            const orderData = new Date().toISOString().slice(0, 19).replace('T', ' '); // Дата заказа

            // Шаг 1: Добавляем запись в таблицу заказов
            const [orderResult] = await db.promise().query(
                'INSERT INTO orders (user_id, total_amount, order_status, order_data) VALUES (?, ?, ?, ?)',
                [userId, totalAmount, 'Создан', orderData]
            );

            const orderId = orderResult.insertId; // Получаем ID нового заказа

            // Шаг 2: Добавляем записи о товарах в таблицу order_games
            await db.promise().query(
                'INSERT INTO order_games (order_id, games_id) VALUES (?, ?)',
                [orderId, item.games_id]
            );

            // Уменьшаем количество товаров на складе
            await db.promise().query('UPDATE games SET all_games = all_games - ? WHERE id = ?', [item.quantity, item.games_id]);
        });

        await Promise.all(orderPromises); // Ждем завершения всех операций с заказами

        // Очистка корзины после покупки
        await db.promise().query('DELETE FROM basket WHERE user_id = ?', [userId]);

        console.log('Все заказы успешно добавлены.');
        res.redirect('/cart'); // Редирект после успешной обработки всех заказов
    } catch (err) {
        console.error('Ошибка при обработке заказа:', err);
        next(err); // Передаем ошибку дальше в middleware
    }
});


module.exports = router;