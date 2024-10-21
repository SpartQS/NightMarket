const createGames = require('../middleware/createGames.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const db = require('../mySQLConnect.js');

cloudinary.config({
    cloud_name: 'dpeciesty',
    api_key: '677448691716362',
    api_secret: 'ng3ZJTRU4ZwuNSUNTPezW6dCk9U'
});

// Настройка multer для временного хранения загруженных файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res, next) => {
    try {
        // Извлечение всех товаров из базы данных
        db.query('SELECT * FROM games', function (err, games) {
            if (err) throw err;

            // Получение пользователя из сессии
            const user = req.session.user;

            // Если пользователь авторизован, получаем игры из корзины
            let basketGameIds = [];
            if (user) {
                db.query(`SELECT games_id FROM basket WHERE user_id = ?`, [user.id], (err, basketResults) => {
                    if (err) throw err;

                    // Получаем ID игр в корзине
                    basketGameIds = basketResults.map(item => item.games_id);

                    // Рендеринг шаблона index.ejs и передача данных о товарах, пользователе и ID игр в корзине
                    res.render('index', { title: 'Главная', games, user, basketGameIds });
                });
            } else {
                // Рендеринг без ID игр в корзине, если пользователь не авторизован
                res.render('index', { title: 'Главная', games, user, basketGameIds });
            }
        });
    } catch (err) {
        next(err);
    }
});



// Маршрут для обработки добавления товара
router.post('/add-product', upload.single('image'), async (req, res, next) => {
    try {
        const { title, description, price, all_games, genre, publisher, developer, trailer } = req.body; // Добавили новые поля

        // Проверка наличия файла
        if (!req.file) {
            return res.status(400).send('Не загружено изображение');
        }

        // Загрузка изображения на Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: title, // Использование названия товара как public_id
            folder: 'products'
        });

        // Удаление загруженного файла с сервера после загрузки на Cloudinary
        fs.unlinkSync(req.file.path);

        // Сохранение информации в базе данных
        db.query(
            `INSERT INTO games (title, description, price, images, all_games, genre, publisher, developer, trailer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, price, uploadResult.secure_url, all_games, genre, publisher, developer, trailer], // Передача новых значений
            (err, result) => {
                if (err) return next(err);
                res.redirect('/');
            }
        );
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        res.status(500).send('Ошибка при загрузке изображения.');
    }
});


// Создание девайса

router.get('/add-product', function (req, res, next) {
    res.render('add-product', { title: 'Добавить товар', user: req.session.user });
});

router.post('/add-product', createGames, function (req, res, next) {
    res.redirect('/');
});

// Редактирование девайса

router.get('/red-game/:id', function (req, res, next) {
    const gameId = req.params.id;

    // Получаем данные о товаре из базы данных
    db.query(`SELECT * FROM games WHERE id = ?`, [gameId], (err, result) => {
        if (err) return next(err);

        // Проверяем, найден ли товар
        if (result.length > 0) {
            const game = result[0];  // Получаем данные о товаре

            // Передаем данные о товаре в шаблон
            res.render('red-game', {
                title: 'Редактировать товар',
                game: game, // Передаем объект game в шаблон
                user: req.session.user, // Передаем пользователя
                gameId: gameId // Передаем ID игры
            });
        } else {
            // Если товар не найден, отправляем ошибку 404
            res.status(404).send('Товар не найден');
        }
    });
});


router.post('/red-game/:id', upload.single('image'), async (req, res, next) => {
    const gameId = req.params.id;
    const { title, description, price, all_games, genre, publisher, developer, trailer } = req.body; // Добавили новые поля

    try {
        // Получение текущего изображения товара
        db.query('SELECT images FROM games WHERE id = ?', [gameId], async (err, result) => {
            if (err) return next(err);

            const existingImageUrl = result[0].images;

            // Проверка на наличие загруженного нового изображения
            let newImageUrl = existingImageUrl; // По умолчанию используем старое изображение
            if (req.file) {
                // Если новое изображение загружено, загружаем его на Cloudinary
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    public_id: title, // Используем название товара как public_id
                    folder: 'products'
                });

                // Удаление загруженного файла с сервера после загрузки на Cloudinary
                fs.unlinkSync(req.file.path);

                // Обновляем URL изображения
                newImageUrl = uploadResult.secure_url;
            }

            // Обновление данных товара в базе данных
            db.query(
                `UPDATE games SET title = ?, description = ?, price = ?, images = ?, all_games = ?, genre = ?, publisher = ?, developer = ?, trailer = ? WHERE id = ?`,
                [title, description, price, newImageUrl, all_games, genre, publisher, developer, trailer, gameId],
                (err, result) => {
                    if (err) return next(err);
                    res.redirect('/');
                }
            );
        });
    } catch (error) {
        console.error('Ошибка при редактировании товара:', error);
        res.status(500).send('Ошибка при редактировании товара.');
    }
});

// Маршрут для отображения страницы с информацией о конкретной игре

router.get('/game_page/:id', (req, res, next) => {
    const gameId = req.params.id;

    // Извлекаем данные об игре из базы данных по её ID
    db.query('SELECT * FROM games WHERE id = ?', [gameId], (err, result) => {
        if (err) return next(err);

        // Проверяем, существует ли игра с таким ID
        if (result.length > 0) {
            const game = result[0];

            // Рендерим страницу с подробной информацией о товаре
            res.render('game_page', {
                title: game.title,
                game: game, // Передаем данные о конкретной игре в шаблон
                user: req.session.user // Передаем информацию о пользователе
            });
        } else {
            // Если игра не найдена, возвращаем ошибку 404
            res.status(404).send('Игра не найдена');
        }
    });
});

// Добавление ключей
router.post('/add-keys/:id', (req, res, next) => {
    const gameId = req.params.id; // ID игры
    const keysString = req.body.keys; // Строка с ключами
    const keyLength = 10; // Длина одного ключа

    // Разделяем строку на массив ключей по запятой и убираем пробелы
    const keysArray = keysString.split(',').map(key => key.trim());

    // Фильтруем ключи, чтобы оставить только те, длина которых равна 10
    const validKeys = keysArray.filter(key => key.length === keyLength);

    // Создаем массив для запросов в базу данных
    const keyInserts = validKeys.map(key => {
        return [key, 'available', gameId]; // Статус ключа по умолчанию "available"
    });

    // SQL-запрос для вставки нескольких строк сразу
    const insertQuery = 'INSERT INTO game_keys (game_key, keystatus, games_id) VALUES ?';

    // Выполняем вставку данных в таблицу game_keys
    db.query(insertQuery, [keyInserts], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении ключей:', err);
            return next(err);
        }

        // После добавления ключей обновляем поле all_games в таблице games
        const countQuery = `
            SELECT COUNT(*) AS key_count 
            FROM game_keys 
            WHERE games_id = ? AND keystatus = 'available'
        `;

        db.query(countQuery, [gameId], (err, countResult) => {
            if (err) {
                console.error('Ошибка при подсчете ключей:', err);
                return next(err);
            }

            const keyCount = countResult[0].key_count;

            // Обновляем поле all_games в таблице games
            const updateQuery = 'UPDATE games SET all_games = ? WHERE id = ?';
            db.query(updateQuery, [keyCount, gameId], (err, updateResult) => {
                if (err) {
                    console.error('Ошибка при обновлении игры:', err);
                    return next(err);
                }

                // Возвращаемся на страницу игры после добавления ключей
                res.redirect('/game_page/' + gameId);
            });
        });
    });
});

// Удаление девайса

router.post('/delete-product', function (req, res, next) {
    const gameId = req.body.gameId;

    db.query('DELETE FROM games WHERE id = ?', [gameId], (err, result) => {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
});
module.exports = router;