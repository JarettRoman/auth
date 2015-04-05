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
require('./app/routes.js')(app, passport, io); //load routes and pass into app and fully configured passport

//LAUNCH=========
//app.listen(port);
server.listen(port, function(){
  console.log('Server listening at port %d', port);
})
//console.log('Code is being slung to port ' + port);