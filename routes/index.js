var express = require('express');
var router = express.Router();
var map;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Journey' });
});

module.exports = router;
