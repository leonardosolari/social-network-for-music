const User = require('../models/User');
const validator = require('validator');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')

module.exports.renderRegister = (req, res) => {
    //recupera i dati dalla session se disponibili
    //const formData = req.session.signupFormData || {};
    const formData = {}
    res.render('users/register', {formData});
}


/**
 * Registrazione utente
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.register = async function (req, res) {
    try {
        const { username, email, password, confirmPassword, } = req.body;
        const validationErrors = [];
        if (validator.isEmpty(req.body.username))
            validationErrors.push({ msg: "L'username non può essere vuoto" });
        else if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: "Inserire un indirizzo email valido" });
        else if (!validator.isLength(req.body.password, { min: 8 }))
            validationErrors.push({
                msg: "La password deve essere lunga almeno 8 caratteri",
            });
        else if(password !== confirmPassword) {
            validationErrors.push({
                msg: 'Le password non coincidono'
            })
        }

        if (validationErrors.length) {
            //se ho avuto errori salvo i valori del form nella session e faccio redirect
            req.session.signupFormData = req.body;
            for (let error of validationErrors) {
                req.flash('error', error.msg)
            }
            return res.redirect('/users/register')
        }



        const user = new User({ 
            email: email,
            username: username, 
        });
        await User.register(user, password);
        req.flash('success', 'Nuovo utente registrato')
        res.redirect('/')


    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/users/register')
    }
} 

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


/**
 * Login utente
 */
module.exports.login = async function(req, res, next) {
    try {
        const {username, password} = req.body;
        if (validator.isEmpty(req.body.username)) {
            req.flash('error', 'Inserire un username valido')
            return res.redirect('/users/login')
        }
        if (validator.isEmpty(req.body.password)) {
            req.flash('error','La password non può essere vuota')
            return res.redirect('/users/login')
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.log(error)
                return next(err);
            }
            if (!user) {
              req.flash("error", 'Username o password non corretti');
              return res.redirect("/users/login");
            }
            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }
              req.flash("success", 'Login effettuato con successo');
              res.redirect(`/users/${req.user._id}`);
              //res.redirect('/')
            });
          })(req, res, next);

    } catch (error) {
        console.log(error)
        req.flash('error', error)
        res.redirect('/users/login')
    }
}


module.exports.logout = function(req, res) {
    req.logout(() => {
        req.flash('success', 'Logout effettuato con successo')
        res.redirect('/')
      })
}


/**
 * Mostra pagina utente
 */
module.exports.showUser = async function (req,res) {
    const user = await User.findById(req.params.id)
    res.render('users/profile', { id: user._id, email: user.email, username: user.username})
}



