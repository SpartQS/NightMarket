const db = require('../mySQLConnect.js');

function getgamesFromDB(callback) {
    // SQL-запрос с сортировкой по убыванию цены
    db.query('SELECT * FROM games ORDER BY price DESC', (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

module.exports = function (req, res, next) {
    getgamesFromDB((err, games) => {
        console.log(games)
        if (err) {
            return next(err);
        }

        // Добавление полученных устройств к объекту запроса
        req.games = games;
        next();
    });
};
