var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fmcsaRoutes = require('./routes/fmcsaRoutes');
var loadRoutes = require('./routes/loadRoutes');

const checkApiKey = require('./routes/checkApiKey');
const loadService = require('./services/loadService');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize CSV data once
loadService.initLoads()
    .then(() => {
      console.log('CSV loads data ready.');
    })
    .catch((err) => {
      console.error('Error initializing loads data:', err);
    });

app.use('/loads', checkApiKey);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fmcsa', fmcsaRoutes); // GET /fmcsa/validate-carrier => FMCSA data
app.use('/loads', loadRoutes);  // GET /loads => data from loads.csv

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

module.exports = app;
