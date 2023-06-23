var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/dashboard', function (req, res, next) {
  res.render('dashboard', {title: 'Express'});
});

/* GET home page. */
router.get('/modal', function (req, res, next) {
  res.render('modal', {title: 'Express'});
});



module.exports = router;
