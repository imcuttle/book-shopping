var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.listen(3500);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'5mb'}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60*24 },
  secret: 'shopping',
  // store: 'MemStore'
}));

app.use(function(req, res, next) {
  var url = req.originalUrl;
  if (url === "/login" || url === "/register") {
    if (req.session.username) {
      res.render('error', {
        title:'发生错误',
        message: '您已经登录，请退出后再操作。',
        error: {},
        req :req,
      });
      return;
    }else{
      next()
      return;
    }
  }
  if (url.startsWith('/users') || url.startsWith("/sell") || url.startsWith("/buy") || url.startsWith("/trade/cart")) {
    if (!req.session.username) {
      req.session.view=url;
      res.redirect('/login');
      return;
    }
  }else if(url.startsWith('/trade') || url.startsWith('/message') || url.startsWith('/search')){
    req.session.view=url;
  }
  next();
});
app.use('/', routes);
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/message', require('./routes/message'));
app.use('/sell', require('./routes/sell'));
app.use('/image', require('./routes/image'));
app.use('/trade', require('./routes/trade'));
app.use('/search', require('./routes/search'));
app.use('/api', require('./routes/api'));
app.use('/users', users);
app.use('/action', (req,res,next)=>{
  var params = req.method==='GET'?req.query:req.body;
  if(params.action==='exit'){
    req.session.destroy((err)=>{
      if(err) delete req.session.username;
      res.redirect('/');
    });
    return;
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title:'发生错误',
      message: err.message,
      error: err,
      req :req,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title:'发生错误',
    message: err.message,
    error: {},
    req :req,
  });
});


module.exports = app;
