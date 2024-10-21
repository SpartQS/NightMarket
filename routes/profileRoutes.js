const express = require('express');
const bcrypt = require('bcrypt');
var checkAuth = require("./../middleware/checkAuth.js");
const router = express.Router();
const db = require('../mySQLConnect.js');

router.get('/profile', checkAuth, async (req, res, next) => {
    const userId = req.session.user.id;

    try {
        const [orders] = await db.promise().query('SELECT * FROM orders WHERE user_id = ?', [userId]);

        const orderIds = orders.map(order => order.id);
        const [games] = await db.promise().query(`
            SELECT g.id AS game_id, g.title, 
                (SELECT k.game_key 
                 FROM game_keys k 
                 WHERE k.games_id = g.id 
                 AND k.keystatus = 'available' 
                 LIMIT 1) AS game_key, 
                og.order_id
            FROM order_games og
            JOIN games g ON og.games_id = g.id
            WHERE og.order_id IN (?)
            GROUP BY g.id, g.title, og.order_id
        `, [orderIds]);

        const ordersWithGames = orders.map(order => ({
            order,
            games: games.filter(game => game.order_id === order.id)
        }));

        res.render('profile', {
            title: 'Личный кабинет',
            user: req.session.user,
            orders: ordersWithGames
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Изменение имени пользователя
router.post('/update-username', (req, res) => {
    const user = req.session.user;
    const newUsername = req.body.username;

    if (!user) {
        return res.redirect('/login');
    }

    db.query('UPDATE user SET username = ? WHERE id = ?', [newUsername, user.id], (err) => {
        if (err) {
            console.error(err);
            return res.render('profile', {
                title: 'Личный кабинет',
                user: user,
                error: 'Не удалось обновить имя пользователя. Попробуйте снова.'
            });
        }

        req.session.user.username = newUsername;
        res.redirect('/profile');
    });
});

// Изменение пароля
router.post('/update-password', async (req, res) => {
    const user = req.session.user;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (!user) {
        return res.redirect('/login');
    }

    if (newPassword !== confirmPassword) {
        return res.render('profile', {
            title: 'Личный кабинет',
            user: user,
            error: 'Новый пароль и подтверждение пароля не совпадают.'
        });
    }

    try {
        const [results] = await db.promise().query('SELECT * FROM user WHERE id = ?', [user.id]);
        const foundUser = results[0];

        const match = await bcrypt.compare(currentPassword, foundUser.password);
        if (!match) {
            return res.render('profile', {
                title: 'Личный кабинет',
                user: user,
                error: 'Текущий пароль неверный.'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.promise().query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, user.id]);

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        return res.render('profile', {
            title: 'Личный кабинет',
            user: user,
            error: 'Не удалось обновить пароль. Попробуйте снова.'
        });
    }
});

// Получение заказов пользователя
router.get('/user_orders', function (req, res, next) {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/logreg');
    }

    const userId = user.id;

    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, orders) => {
        if (err) {
            console.error('Ошибка при получении заказов пользователя:', err);
            return next(err);
        }

        res.render('user_orders', { title: 'Мои заказы', orders, error: null, user });
    });
});

// Отправка ключа пользователю
router.post('/send-key', async (req, res) => {
    const { gameId, userId, orderId } = req.body;

    try {
        // Выбираем первый доступный (не активированный) ключ
        const [gameKeyResult] = await db.promise().query(
            'SELECT * FROM game_keys WHERE games_id = ? AND keystatus = "available" LIMIT 1',
            [gameId]
        );

        if (gameKeyResult.length === 0) {
            return res.status(404).json({ message: 'Ключи больше недоступны' });
        }

        const gameKey = gameKeyResult[0];

        // Обновляем статус ключа на "inaccessible" (ключ активирован)
        await db.promise().query('UPDATE game_keys SET keystatus = "inaccessible" WHERE id = ?', [gameKey.id]);
        await db.promise().query('UPDATE orders SET order_status = "проведен" WHERE id = ?', [orderId]);

        res.status(200).json({
            message: 'Ключ успешно отправлен пользователю.',
            gameKey: gameKey.game_key, // Возвращаем ключ вместе с сообщением
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера.' });
    }
});

module.exports = router;
