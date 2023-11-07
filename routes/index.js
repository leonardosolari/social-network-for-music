var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/prova', function(req, res) {
  res.send("Questa è la pagina di prova")
})

module.exports = router;
