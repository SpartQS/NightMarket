const express = require('express');
const router = express.Router();
const db = require('../mySQLConnect.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Регистрация 

// Роут для отображения страницы входа
router.get('/login', async function (req, res, next) {
    const user = req.session.user;
    const errorMessage = res.locals.errorMessage || null;
    res.render('login', { title: 'Вход', error: errorMessage, user: user });
});


// Роут для обработки данных формы входа
router.post('/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    // Поиск пользователя по email
    db.query('SELECT * FROM user WHERE email = ?', [email], function (err, users) {
        if (err) return next(err);

        if (users.length > 0) {
            var user = users[0];

            // Сравнение введенного пароля с хэшированным паролем
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) return next(err);

                if (result) {
                    // Пароли совпадают
                    req.session.user = user;
                    res.redirect('/');
                } else {

                    res.render('login', { title: 'Вход', error: "Неверный пароль", user: null });
                }
            });
        } else {

            res.render('login', { title: 'Вход', error: "Пользователь не найден", user: null });
        }
    });
});


// Роут для выхода из системы
router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.locals.user = null;
    res.redirect('/');
});

// Роут для отображения страницы регистрации
router.get('/register', async function (req, res, next) {
    res.render('register', { title: 'Регистрация', error: null, user: req.session.user });
});

// Роут для обработки данных формы регистрации
router.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    // Регулярное выражение для проверки корректности email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Проверка email на корректность
    if (!emailPattern.test(email)) {
        return res.render('register', { title: 'Регистрация', error: 'Неверный формат email', user: null });
    }

    // Проверка на существование пользователя с таким email или именем
    db.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, email], function (err, users) {
        if (err) return next(err);
        if (users.length > 0) {
            return res.render('register', { title: 'Регистрация', error: 'Пользователь с таким именем или email уже существует', user: null });
        }

        // Хэшируем новый пароль
        const hashedPassword = bcrypt.hashSync(password, 10); // Хеширование пароля

        // Вставка нового пользователя в базу данных
        db.query('INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            function (err, result) {
                if (err) return next(err);


                req.session.user = result.insertId;
                res.locals.user = { id: result.insertId, username: username, email: email };


                res.redirect('/');
            });
    });
});

// Роут для отображения страницы "Забыли пароль"
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        title: 'Забыли пароль?',
        error: null,
        message: null
    });
});

// Роут для обработки формы "Забыли пароль"
router.post('/forgot-password', (req, res, next) => {
    const email = req.body.email;

    // Проверка наличия пользователя с таким email в базе данных
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, users) => {
        if (err) return next(err);

        if (users.length === 0) {
            return res.render('forgot-password', {
                title: 'Забыли пароль?',
                error: 'Пользователь с таким email не найден',
                message: null
            });
        }

        const user = users[0];
        const resetCode = generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        // Сохраняем код и время истечения в базе данных
        db.query('UPDATE user SET reset_code = ?, reset_code_expiry = ? WHERE email = ?',
            [resetCode, resetTokenExpiry, email],
            (err) => {
                if (err) return next(err);

                // Отправка кода сброса пароля на email
                sendResetEmail(email, resetCode);

                // Перенаправляем на страницу ввода кода
                res.redirect(`/verify-code?email=${encodeURIComponent(email)}`);
            });
    });
});

// Генерация кода для восстановления пароля
function generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Отправка письма с кодом сброса пароля
function sendResetEmail(email, resetCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "",
            pass: "",
        }
    });

    const mailOptions = {
        from: '',
        to: email,
        subject: 'Восстановление пароля',
        text: `Ваш код для восстановления пароля: ${resetCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Ошибка при отправке email:', error);
        } else {
            console.log('Письмо успешно отправлено:', info.response);
        }
    });
}

// Роут для отображения страницы ввода кода
router.get('/verify-code', (req, res) => {
    const { email } = req.query; // Получаем email из параметров запроса
    res.render('verify-code', {
        title: 'Проверка кода',
        error: null,
        message: null,
        email // Передаем email на страницу
    });
});

// Роут для обработки кода
router.post('/verify-code', (req, res, next) => {
    const { code, email } = req.body;

    // Проверка кода в базе данных
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, users) => {
        if (err) return next(err);

        if (users.length === 0) {
            return res.render('verify-code', {
                title: 'Проверка кода',
                error: 'Пользователь с таким email не найден',
                message: null,
                email // Передаем email на страницу
            });
        }

        const user = users[0];

        // Проверяем, совпадает ли введенный код с кодом в базе данных и не истек ли он
        if (user.reset_code === code && new Date() < new Date(user.reset_code_expiry)) {
            // Код правильный, перенаправляем на страницу смены пароля
            res.render('reset-password', {
                title: 'Смена пароля',
                email, // Передаем email на страницу
                error: null,
                message: null
            });
        } else {
            // Код неверный или истек
            return res.render('verify-code', {
                title: 'Проверка кода',
                error: 'Неверный код или срок его действия истек',
                message: null,
                email // Передаем email на страницу
            });
        }
    });
});

// Роут для смены пароля
router.post('/reset-password', (req, res, next) => {
    const { password, email } = req.body;

    // Хэшируем новый пароль (не забудьте установить bcrypt)
    const hashedPassword = bcrypt.hashSync(password, 10); // Хеширование пароля

    // Обновляем пароль в базе данных
    db.query('UPDATE user SET password = ?, reset_code = NULL, reset_code_expiry = NULL WHERE email = ?',
        [hashedPassword, email],
        (err) => {
            if (err) return next(err);

            res.render('reset-password', {
                title: 'Смена пароля',
                email: null,
                error: null,
                message: 'Пароль успешно изменен!'
            });
        });
});

module.exports = router;
