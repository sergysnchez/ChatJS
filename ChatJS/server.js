/**
 * @app Restaurants
 * @version 1.0
 * @author Sergio Sanchez
 */

//Dependencias
var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require('client-sessions');
var log4js = require('log4js');
var socketUsers = require('socket.io.users');
var fs = require('fs');
var session = require('express-session');

//Cookies
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");

//Configuración del Log
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/log.log'), 'CHAT');
var logger = log4js.getLogger('CHAT');
logger.setLevel('ALL');

//Especificamos las rutas
var routes = require('./public/routes/users')(app)
var routes = require('./public/routes/messages')(app)

//Conexión a la BBDD
mongoose.connect('mongodb://localhost/users', function(err, res) {
if(err) {
  console.log('ERROR: connecting to Database. ' + err);
} else {
  console.log('Connected to Database');
}
});

app.use(express.cookieParser('shhhh, very secret'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
app.use(express.session());     

//Mensajes
var messages = [];
var sess;

//Contenido estatico de la app
app.use(express.static('public'));

//Acceso a peticiones request
app.use(express.bodyParser());

app.get('/hello', function(req, res) {  
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets: ' + socket.id);
  logger.info("------------------- NEW CONNECTION FROM " + socket.id);

  socket.on('new-message', function(data, messages, user) { 
    messages.push(data);
    io.sockets.emit('messages'+user, messages);
  });
  
  socket.on('load-conver', function(data, user){  
	  io.sockets.emit('loadConversation'+user, data);
  });
  
  socket.on('send-image', function(img, messages, user, destinatario){
	  io.sockets.emit('renderImg'+user, img);
	  io.sockets.emit('renderImg'+destinatario, img);
  });
  
});

server.listen(80, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
});
 