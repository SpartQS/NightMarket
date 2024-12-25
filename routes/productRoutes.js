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
        db.query(`
            SELECT 
                *,
                CASE 
                    WHEN discount_percentage > 0 AND (discount_expiration IS NULL OR discount_expiration > NOW()) 
                    THEN price - (price * discount_percentage / 100) 
                    ELSE price 
                END AS discounted_price
            FROM games
        `, function (err, games) {
            if (err) throw err;

            const user = req.session.user;

            let basketGameIds = [];
            if (user) {
                db.query(`SELECT games_id FROM basket WHERE user_id = ?`, [user.id], (err, basketResults) => {
                    if (err) throw err;

                    basketGameIds = basketResults.map(item => item.games_id);

                    res.render('index', {
                        title: 'Главная',
                        games,
                        user,
                        basketGameIds
                    });
                });
            } else {
                res.render('index', {
                    title: 'Главная',
                    games,
                    user,
                    basketGameIds
                });
            }
        });
    } catch (err) {
        next(err);
    }
});




// Маршрут для обработки добавления товара
router.post('/add-product', upload.single('image'), async (req, res, next) => {
    try {
        const { title, description, price, all_games, genre, publisher, developer, trailer, system_requirements } = req.body; // Добавили новые поля

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
            `INSERT INTO games (title, description, price, images, all_games, genre, publisher, developer, trailer, system_requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, price, uploadResult.secure_url, all_games, genre, publisher, developer, trailer, system_requirements], // Передача новых значений
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
    const {
        title,
        description,
        price,
        genre,
        publisher,
        developer,
        trailer,
        system_requirements,
        discount_percentage,
        discount_expiration
    } = req.body;

    const validDiscountExpiration = discount_expiration.trim() === '' ? null : discount_expiration;
    try {
        db.query('SELECT images FROM games WHERE id = ?', [gameId], async (err, result) => {
            if (err) return next(err);

            const existingImageUrl = result[0].images;

            let newImageUrl = existingImageUrl;
            if (req.file) {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    public_id: title,
                    folder: 'products'
                });
                fs.unlinkSync(req.file.path);
                newImageUrl = uploadResult.secure_url;
            }

            // Обновляем данные игры вместе с пересчётом цены
            db.query(
                `UPDATE games 
                 SET 
                    title = ?, 
                    description = ?, 
                    price = ?, 
                    images = ?, 
                    genre = ?, 
                    publisher = ?, 
                    developer = ?, 
                    trailer = ?, 
                    system_requirements = ?,
                    discount_percentage = ?, 
                    discount_expiration = ?, 
                    price = CASE 
                        WHEN ? > 0 AND (? IS NULL OR ? > NOW()) 
                        THEN ? - (? * ? / 100) 
                        ELSE ? 
                    END
                 WHERE id = ?`,
                [
                    title,
                    description,
                    price,
                    newImageUrl,
                    genre,
                    publisher,
                    developer,
                    trailer,
                    system_requirements,
                    discount_percentage || 0,
                    validDiscountExpiration,
                    discount_percentage,
                    validDiscountExpiration,
                    validDiscountExpiration,
                    price,
                    price,
                    discount_percentage || 0,
                    price,
                    gameId,
                ],
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
    db.query(`
        SELECT 
            *,
            CASE 
                WHEN discount_percentage > 0 AND (discount_expiration IS NULL OR discount_expiration > NOW()) 
                THEN price - (price * discount_percentage / 100) 
                ELSE price 
            END AS discounted_price
        FROM games WHERE id = ?
    `, [gameId], (err, result) => {
        if (err) return next(err);

        if (result.length > 0) {
            const game = result[0];
            res.render('game_page', { title: game.title, game, user: req.session.user });
        } else {
            res.status(404).send('Игра не найдена');
        }
    });

});

// Добавление ключей
router.post('/add-keys/:id', (req, res, next) => {
    const gameId = req.params.id; // ID игры
    const keysString = req.body.keys; // Строка с ключами
    const keyLength = 10; // Длина одного ключа

    // Разделяем строку на массив ключей по запятой или пробелам и убираем пробелы
    const keysArray = keysString.split(/[\s,]+/).map(key => key.trim()).filter(key => key.length > 0);

    // Фильтруем ключи, чтобы оставить только те, длина которых равна 10
    const validKeys = keysArray.filter(key => key.length === keyLength);

    // Проверяем, что есть хотя бы один валидный ключ для добавления
    if (validKeys.length === 0) {
        return res.status(400).send('Не найдено валидных ключей для добавления.');
    }

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