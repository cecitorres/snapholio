module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  },
  ensureGuest: function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/assigments');
    } else {
      return next();
    }
  },
  ensureAdmin: function(req, res, next){
    if(req.user == null || req.user == undefined || req.user.isAdmin == false) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/');
    } else {
      return next();
    }
  }
}