const User = require('../models/User');
const validator = require('validator');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const { fetchGenres } = require('../utils/spotifyFetch')
const Playlist = require('../models/Playlist')

module.exports.renderRegister = async (req, res) => {
    //recupera i dati dalla session se disponibili
    // const formData = req.session.signupFormData || {};
    const formData = {}
    const genres = await fetchGenres()
    res.render('users/register', {formData, genres});
}


/**
 * Registrazione utente
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.register = async function (req, res) {
    try {
        const { username, email, password, confirmPassword, genreSelector } = req.body;
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
            favorite_genres: [genreSelector], 
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
        if (!req.body.username || !req.body.password) {
            res.status(500)
            return res.send()
        }

        if (validator.isEmpty(req.body.username)) {
            req.flash('error', 'Inserire un username valido')
            res.status(500)
            return res.redirect('/users/login')
        }
        if (validator.isEmpty(req.body.password)) {
            req.flash('error','La password non può essere vuota')
            res.status(500)
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
                const redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                res.redirect(redirectTo);
            });
          })(req, res, next);

    } catch (error) {
        res.status(500)
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
 * Mostra informazioni su un utente
 */
module.exports.showUser = async function (req,res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Get current logged user (AUTH required)"
    */
    
    const user = await User.findById(req.params.id)
    res.format({
        'text/html': function () {
            res.render('users/showUser', { 
                id: user.id, 
                email: user.email, 
                username: user.username, 
                fav_genres: user.favorite_genres, 
                fav_artists: user.favorite_artists,
                req_id: req.params.id
            })
        },
        'application/json': function() {
            res.send(user)
        }
    })
}


module.exports.renderChangePassword = function(req, res) {
    res.render('users/changePassword')
}

module.exports.changePassword = async function(req,res) {
    if (validator.isEmpty(req.body.oldPassword) || validator.isEmpty(req.body.newPassword) || validator.isEmpty(req.body.confirmPassword)){
        req.flash('error','Tutti i campi devono essere riempiti')
        return res.redirect('back')
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        req.flash('error', 'Le password non corrispondono')
        return res.redirect('back')
    }

    const user = await User.findById(req.user.id)
    
    try {
        await user.changePassword(req.body.oldPassword, req.body.newPassword)
        req.flash('success', 'Password cambiata con successo')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('/')
    }

    
}

module.exports.deleteUser = async function(req,res) {
    try {
        const user = await User.findByIdAndDelete(req.user.id)
        req.flash('success', 'Account utente eliminato')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
}


module.exports.renderEditUser = async function(req, res) {
    const user = await User.findById(req.params.id)
    const genres = await fetchGenres()
    res.render('users/editUser', { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        fav_genres: user.favorite_genres, 
        fav_artists: user.favorite_artists,
        req_id: req.params.id,
        genres: genres
    })
}

module.exports.editUser = async function(req, res) {
    const { username, email, genreSelector } = req.body
    const id = req.user.id
    
    if (!validator.isEmail(email)) {
        req.flash('error', 'Inserire una email valida')
        res.redirect('back')
    }

    if (validator.isEmpty(username)) {
        req.flash('error', 'Inserire un username valido')
        res.redirect('back')
    }

    const favorite_genres = [genreSelector]
    try {
        const user = await User.findByIdAndUpdate(id, {username, email, favorite_genres})
        req.flash('success', 'Profilo aggiornato con successo')
        res.redirect(`/users/${req.user.id}`)    
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
    
}



