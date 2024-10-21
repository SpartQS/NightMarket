const db = require('./../mySQLConnect');

module.exports = function (req, res, next) {
  res.locals.nav = [];
  db.query('SELECT title, id FROM games', function (err, result) {
    if (err) throw err;
    res.locals.nav = result;
    next();
  });
};