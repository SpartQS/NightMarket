var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var mysql2 = require('mysql2');
var MySQLStore = require('express-mysql-session')(session);
var fs = require('fs-extra');
var cron = require('node-cron');


var authRoutes = require('./routes/authRoutes');
var cartRoutes = require('./routes/cartRoutes');
var productRoutes = require('./routes/productRoutes');
var reportRoutes = require('./routes/reportRoutes');
var ordersRoutes = require('./routes/ordersRoutes');
var profileRoutes = require('./routes/profileRoutes');
var userRoutes = require('./routes/users');

var app = express();

var options = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'yasuo',
  database: 'online_magazin'
};

var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore(options, connection);

cron.schedule('0 0 * * *', () => {
  connection.query(
    `UPDATE games SET discount_percentage = 0, discount_expiration = NULL WHERE discount_expiration <= NOW()`,
    (err, result) => {
      if (err) {
        console.error('Ошибка при очистке скидок:', err);
      } else {
        console.log('Просроченные скидки успешно удалены.');
      }
    }
  );
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

app.use(session({
  secret: 'Aslan',
  key: 'cluch',
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1800000
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  req.session.counter = req.session.counter + 1 || 1;
  next();
});

app.use(require("./middleware/createUser.js"));
app.use(require("./middleware/createMenu.js"));

// Добавление новых маршрутов
app.use('/', authRoutes);
app.use('/', cartRoutes);
app.use('/', productRoutes);
app.use('/', reportRoutes);
app.use('/', ordersRoutes);
app.use('/', profileRoutes);
app.use('/', userRoutes);

async function exportDataToJson() {
  try {
    const orders = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM orders', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const orderGames = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM order_games', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const games = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM games', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const dataToExport = {
      orders: orders,
      orderGames: orderGames,
      games: games  // Добавляем данные из таблицы games
    };

    // Запись данных в JSON-файл
    await fs.outputJson('./data/dataExport.json', dataToExport, { spaces: 2 });
    console.log('Данные успешно экспортированы в dataExport.json');
  } catch (err) {
    console.error('Ошибка при экспорте данных:', err);
  }
}

exportDataToJson();

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: "Что-то не так..." });
});

module.exports = app;
