var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/indexAdmin', function(req, res, next) {
  res.render('indexAdmin', { title: 'Admin' });
});
router.get('/loaisp', function(req, res, next) {
  res.render('loaisp', { title: 'Admin' });
});
router.get('/taikhoans', function(req, res, next) {
  res.render('taikhoans', { title: 'Admin' });
});
router.get('/themsanpham', function(req, res, next) {
  res.render('themsanpham', { title: 'Admin' });
});
module.exports = router;