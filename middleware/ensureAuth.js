module.exports.ensureAuth = function (req, res, next) {
      if (!req.isAuthenticated()) {
        res.status(403)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Effettua il login')
        return res.redirect("/users/login");
      } 

      next();
    }