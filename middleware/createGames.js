const db = require('../mySQLConnect.js');

module.exports = function (req, res, next) {
    const { title, description, price, image, all_games, genre, publisher, developer, trailer } = req.body;
    console.log(title, description, price, image, all_games, genre, publisher, developer, trailer);

    db.query(`
        INSERT INTO games (title, description, price, images, all_games, genre, publisher, developer, trailer) 
        VALUES ('${title}', '${description}', ${price}, '${image}', ${all_games}, '${genre}', '${publisher}', '${developer}', '${trailer}')
    `, (err, result) => {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
}
