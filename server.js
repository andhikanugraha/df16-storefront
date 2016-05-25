let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let lodash = require('lodash');
let fetch = require('node-fetch');

let listen = require('./listen');

let app = express();

let config = {
  api: process.env.API_ENDPOINT || 'http://localhost:3001',
  port: process.env.PORT || 3000
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res, next) {
  res.render('index', { });
});

app.get('/order/:qty', function(req, res, next) {
  let qty = req.params.qty;
  res.render('order-form', { qty: qty });
});

app.post('/order', function(req, res, next) {
  let sanitizedData = {
    qty: lodash.toInteger(req.body.qty),
    name: lodash.toString(req.body.name),
    email: lodash.toString(req.body.email),
    address: lodash.toString(req.body.address)
  };
  
  fetch(config.api + '/order', {
    method: 'POST',
    body: JSON.stringify(sanitizedData),
    headers: {
      'content-type': 'application/json'
    }
  }).then(function() {
    res.render('order-received', { });
  }).catch(function(err) {
    // Ignore error
    console.log(err);
    res.render('order-received', { });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

listen(app, config.port);
