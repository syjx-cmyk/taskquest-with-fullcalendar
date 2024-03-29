var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv');
dotenv.config();

var mongoose = require('mongoose');

var mongodb_uri = process.env.MONGODB_URL ? process.env.MONGODB_URL : process.env.MONGOLAB_URI;
mongodb_uri = mongodb_uri ? mongodb_uri : "localhost";

console.log(mongodb_uri + "/taskquest");
mongoose.connect(mongodb_uri + '/taskquest');

var routes = require('./routes/index');
var users = require('./routes/users');
var boards = require('./routes/boards');
var tickets = require('./routes/tickets');
var logs = require('./routes/logs');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'skin')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/boards', boards);
app.use('/tickets', tickets);
app.use('/logs', logs);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
