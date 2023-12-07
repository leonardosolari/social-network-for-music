const User = require('../models/User');
const validator = require('validator');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const { fetchGenres } = require('../utils/spotifyFetch')
const Playlist = require('../models/Playlist')
const {getArtistById} = require('../utils/getSpotifyInfo')

module.exports.renderRegister = async (req, res) => {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Renders the user registration page"
    */
    
    //recupera i dati dalla session se disponibili
    // const formData = req.session.signupFormData || {};
    const formData = {}
    const genres = await fetchGenres()
    res.render('users/register', {formData, genres});
}



module.exports.register = async function (req, res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Creates new user and saves it in the database"
    */
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
            res.status(500)
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
        res.status(200)
        req.flash('success', 'Nuovo utente registrato')
        res.redirect('/')


    } catch (error) {
        res.status(500)
        req.flash('error', error.message)
        res.redirect('/users/register')
    }
} 

module.exports.renderLogin = (req, res) => {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Renders the user login page"
    */
    res.render('users/login');
}



module.exports.login = async function(req, res, next) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "User login"
    */
    
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400)
            return res.send()
        }

        if (validator.isEmpty(req.body.username)) {
            req.flash('error', 'Inserire un username valido')
            res.status(400)
            return res.redirect('/users/login')
        }
        if (validator.isEmpty(req.body.password)) {
            req.flash('error','La password non può essere vuota')
            res.status(400)
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
                res.redirect('/');
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
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Logs out current user (AUTH required)"
    */
    try {
        req.logout(() => {
            req.flash('success', 'Logout effettuato con successo')
            res.redirect('/')
          })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
    
}



module.exports.showUser = async function (req,res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Get information about the user with the given id (AUTH required)"
    */
    try {
        const user = await User.findById(req.params.id)
        const followedArtists = []
        for (let artistId of user.favorite_artists) {
            followedArtists.push(await getArtistById(artistId))
        }
        res.format({
            'text/html': function () {
                res.render('users/showUser', { 
                    id: user.id, 
                    email: user.email, 
                    username: user.username, 
                    fav_genres: user.favorite_genres, 
                    fav_artists: followedArtists,
                    req_id: req.params.id
                })
            },
            'application/json': function() {
                res.send(user)
            }
        })
        res.status(200)
    } catch (error) {
        console.log(error)
        res.status(500)
    }
    
}


module.exports.renderChangePassword = function(req, res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Renders the form for password change (AUTH required)"
    */
    res.render('users/changePassword')
}

module.exports.changePassword = async function(req,res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Change current user's password (AUTH required)"
    */
    if (validator.isEmpty(req.body.oldPassword) || validator.isEmpty(req.body.newPassword) || validator.isEmpty(req.body.confirmPassword)){
        req.flash('error','Tutti i campi devono essere riempiti')
        res.status(400)
        return res.redirect('back')
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        res.status(400)
        req.flash('error', 'Le password non corrispondono')
        return res.redirect('back')
    }
    
    try {
        const user = await User.findById(req.user.id)
        await user.changePassword(req.body.oldPassword, req.body.newPassword)
        res.status(200)
        req.flash('success', 'Password cambiata con successo')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.status(500).redirect('/')
    }

    
}

module.exports.deleteUser = async function(req,res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Deletes current user's profile from the database (AUTH required)"
    */
    try {
        const user = await User.findByIdAndDelete(req.user.id)
        req.flash('success', 'Account utente eliminato')
        res.status(200).redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.status(500).redirect('back')
    }
}


module.exports.renderEditUser = async function(req, res) {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Renders current user's page to edit account information (AUTH required)"
    */
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
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Edit current user profile (AUTH required)"
    */
    const { username, email, genreSelector } = req.body
    const id = req.user.id
    
    if (!validator.isEmail(email)) {
        req.flash('error', 'Inserire una email valida')
        res.status(400)
        res.redirect('back')
    }

    if (validator.isEmpty(username)) {
        req.flash('error', 'Inserire un username valido')
        res.status(400)
        res.redirect('back')
    }

    const favorite_genres = [genreSelector]
    try {
        const user = await User.findByIdAndUpdate(id, {username, email, favorite_genres})
        req.flash('success', 'Profilo aggiornato con successo')
        res.status(200)
        res.redirect(`/users/${req.user.id}`)    
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.status(500)
        res.redirect('back')
    }
    
}

module.exports.followArtist = async function(req, res) {

}

module.exports.unfollowArtist = async function(req, res) {

}



