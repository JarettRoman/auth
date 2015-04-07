//get all the tools we need
//so we wont have to return to this file.

var express   = require('express');
var app       = express();
var port      = process.env.PORT || 8080;
var mongoose  = require('mongoose');
var passport  = require('passport');
var flash     = require ('connect-flash');
var server    = require('http').createServer(app);
var io        = require('socket.io')(server);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//for database - see if I can use MySQL db instead of mongodb
var configDB = require('./config/database.js');

//CONFIGURATION===============

//connect to our database
mongoose.connect(configDB.url);

//pass pasport for configuration
require('./config/passport')(passport);

//set up our express application
app.use(morgan('dev')); //log every request to console
app.use(cookieParser());//read cookies (needed for auth)
app.use(bodyParser());  //get information from html forms

app.set('view engine', 'ejs'); //set up ejs for templating

//required for passport
app.use(session({secret: 'swagnificent' })); //session secret
app.use(passport.initialize());
app.use(passport.session());//persistent login sessions
app.use(flash());//use connect-flash for flash messages stored in session

//ROUTES=========
require('./app/routes.js')(app, passport); //load routes and pass into app, io, and fully configured passport

//SOCKET.IO======
var usernames = {};

io.on('connection', function(socket){
  //Socket.io functions 'listen' to calls from the client. For the above, io.on() is listening for the 'connection'
  //flag and then executes the below functions, which are also listening for their own calls.
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    //console.log('message: ' + msg);
  });

  socket.on('sendchat', function(data) {
    //tell client to execute 'updatechat' with 2 parameters
    io.emit('updatechat', socket.username, data);
  });

  socket.on('adduser', function(username){
    //store username in the socket session for this client
    socket.username = username;
    //add the client's username to the global list
    usernames[username] = username;
    //tell the user they've connected.
    socket.emit('updatechat', 'SERVER', 'you have connected');
    //tell everyone (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    //update the list of users in chat, client-side
    io.emit('updateusers', usernames);
  });

  socket.on('disconnect', function(){
    //remove username from the usernames list
    delete usernames[socket.username];
    //update client-side list of users to reflect delete
    io.emit('updateusers', usernames);
    //announce this user has disconnected
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has left');
  });
});

//LAUNCH=========
//app.listen(port);
server.listen(port, function(){
  console.log('Server listening at port %d', port);
})
//console.log('Code is being slung to port ' + port);