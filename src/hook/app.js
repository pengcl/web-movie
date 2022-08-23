var express = require('express');
var path = require('path');
var apiService = require('./routes/service');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials/');
app.use('/apiService', apiService);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//sudo ng serve --proxy api.json --port 80

