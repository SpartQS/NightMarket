const db = require('../mySQLConnect.js');

function getLowStockgamesFromDB(callback) {
    db.query('SELECT * FROM games WHERE all_games < 10', (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

module.exports = function (req, res, next) {
    getLowStockgamesFromDB((err, lowStockgames) => {
        if (err) {
            return next(err);
        }

        // Добавление полученных устройств к объекту запроса
        req.lowStockgames = lowStockgames;
        next();
    });
};
