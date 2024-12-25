const db = require('../mySQLConnect.js');

module.exports = function (req, res, next) {
    const { title, description, price, all_games, genre, publisher, developer, trailer, system_requirements, discount_percentage, discount_expiration } = req.body;

    db.query(
        `INSERT INTO games (title, description, price, images, all_games, genre, publisher, developer, trailer, system_requirements, discount_percentage, discount_expiration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, price, uploadResult.secure_url, all_games, genre, publisher, developer, trailer, system_requirements, discount_percentage || 0, discount_expiration || null],
        (err, result) => {
            if (err) return next(err);
            res.redirect('/');
        }
    );

}
