module.exports = function(app, passport) {

  //HOME PAGE ==========
  /*app.get('/', function(req, res) {
    res.render('index.ejs'); //Load the index.ejs file at the root
  });
  */

  //LOGIN PAGE ==========
  //shows the login form
  //changed the request handler so we reroute users to
  //login page when they access the root.
  app.get('/', function(req, res) {
    //render the page and pass in any flash data if it exists
    res.render('index.ejs', { message: req.flash('loginMessage')});
    //
  });

  // process login form
  app.post('/', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/',
    failureFlash : true
  }));

  //SIGNUP =========
  //show the signup form
  app.get('/signup', function(req, res) {
    //console.log('inside the app.get signup function')
    //render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage')});
  });

  //process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    //console.log('We are in the app.post signup function');
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup',  // redirect back to the signup page if there's an error
    failureFlash : true // allow flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user //get the user out of the session to pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

//route middleware to make sure a user is logged in
//could possibly use for getting people to the chat app
//if they're logged in - look at how the profile route is set up
function isLoggedIn(req, res, next) {
  //if user is authenticated in the session, keep it moving
  if(req.isAuthenticated())
    return next();

  //if they aren't, redirect them to the home page
  res.redirect('/');
};