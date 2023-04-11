var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var errorMiddleware = require('./middleware/error');
var colors = require('colors');
var config = require('./configs/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sanphamRouter = require('./routes/sanpham');
var taikhoanRouter = require('./routes/taikhoan');
var orderRouter = require('./routes/order');
var indexAdminRouter = require('./routes/admin');
var loaiRouter = require('./routes/loaisp');


var app = express();

// view engine setup
app.use("/public", express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1',sanphamRouter);
app.use('/api/v1',taikhoanRouter);
app.use('/api/v1',orderRouter);
app.use('/api/v1',loaiRouter);

app.use('/admin',indexAdminRouter);
//Middleware for Errors
app.use(errorMiddleware);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// kết nối MongoDB
mongoose.connect(config.databaseURL+config.databaseName);
mongoose.connection.once('open',()=>{
  console.log("connected".magenta);
}).on('error',(error)=>{
  console.log(error+"".red);
})






module.exports = app;
