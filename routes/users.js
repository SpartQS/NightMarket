var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
})

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', {
    title: 'Политика конфиденциальности'
  });
});

module.exports = router;
