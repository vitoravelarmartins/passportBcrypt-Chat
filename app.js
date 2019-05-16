var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  require('./auth')(passport);
  app.use(session({
    store: new MongoStore({
      db: global.db,
      ttl: 30 * 60 // = 30 minutos de sessão
    }),
    secret: 'bigleaf', //configure um segredo seu aqui
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize());
  app.use(passport.session());


  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
