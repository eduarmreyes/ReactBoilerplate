// Babel ES6/JSX Compiler
require('babel-register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// var async = require('async');
// var colors = require('colors');
// var mongoose = require('mongoose');
// var request = require('request');
// var _ = require('underscore');
var swig  = require('swig');

var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');


// config

// routes
var routes = require('./app/routes');

// models

var app = express();

app.set('port', process.env.PORT || 3031);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// mongoose

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found');
    }
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack.red);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

/**
 * Socket.io stuff.
 */
// var server = require('http').createServer(app);
var onlineUsers = 0;
/*var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});
*/

// api routes

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '. With online users ' + onlineUsers);
});
