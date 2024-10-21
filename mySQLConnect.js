var mysql = require('mysql2');
var db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'yasuo',
    database: 'online_magazin'
});
db.connect(function (err) {
    if (err) {
        console.log("Error:"); throw err;
    } else {
        console.log("Connect.");
    }
});
module.exports = db;