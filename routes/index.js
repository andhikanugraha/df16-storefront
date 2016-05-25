var express = require('express');
var router = express.Router();

var apiClient = require('../apiClient.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tahu Bulat Digoreng Dadakan' });
});

router.get('/order/:qty', function(req, res, next) {
  let qty = req.params.qty;
  res.render('order-form', { title: 'Tahu Bulat Digoreng Dadakan', qty: qty });
});

router.post('/order', function(req, res, next) {
  res.render('order-received', { title: 'Tahu Bulat Digoreng Dadakan' });
});

module.exports = router;
