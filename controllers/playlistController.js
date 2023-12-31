const Playlist = require('../models/Playlist')
const User = require('../models/User')
const {fetchTrackById: getTrackById} = require('../utils/spotifyFetch')
const {filterTrackFields} = require('../utils/spotifyResponseParser')
const validator = require('validator');

module.exports.renderCreate = function(req,res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Render playlist creation page (AUTH required)"
    */
    res.render('playlist/createPlaylist')
}

module.exports.create = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Create new playlist and save it in the database (AUTH required)"
    */
    const { name, description, private, tags } = req.body


    try {
        await Playlist.create({
            name: name,
            description: description,
            author: req.user.id, 
            collaborators: [req.user.id],
            private: private,
            tags: tags
        })
        req.flash('success', 'Nuova playlist creata, ora puoi aggiungerci delle canzoni')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('/playlist/create')
    }
}

module.exports.userPlaylists = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Gets playlists created or saved by the user with the given id (AUTH required)"
    */
    const userPlaylists = await Playlist.find({author: req.user.id})
    const user = await User.findById(req.user.id)
    const savedPlaylists = []
    for (let playlist of user.saved_playlists) {
        savedPlaylists.push(await Playlist.findById(playlist))
    }
    const response = {
        userPlaylists: userPlaylists,
        savedPlaylists: savedPlaylists
    }

    res.format({
        'text/html': function () {
            res.render('playlist/userPlaylist2', {userPlaylists, savedPlaylists: savedPlaylists})
        },
        'application/json': function() {
            res.status(200).send(response)
        }
    })
}

module.exports.showPlaylist = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Get playlist by id (AUTH required)"
    */
    try {
        const playlist = await Playlist.findById(req.params.id)
        const author = await User.findById(playlist.author)
        const username = author.username
        const tags = playlist.tags.split("_")
        const playlistTracks = []
        for (let trackId of playlist.tracks) {
            const response = await getTrackById(trackId)
            playlistTracks.push(filterTrackFields(response))
        }
        
        res.format({
            'text/html': function () {
                res.render('playlist/showPlaylist', {playlist, playlistTracks, username, tags})
            },
            'application/json': function() {
                res.status(200)
                res.send(playlist)
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('/')
    }
    

}


module.exports.renderEditPlaylist = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Render playlist edit page (AUTH required)"
    */
    const playlist = await Playlist.findById(req.params.id)
    res.render('playlist/editPlaylist', {
        id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        tags: playlist.tags
    })
}



module.exports.editPlaylist = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Edit playlist with given id (AUTH required)"
    */

    try {
        const {name, description, tags} = req.body
        const playlist = await Playlist.findByIdAndUpdate(req.params.id, {name, description, tags})
        res.status(200)
        req.flash('success', 'Playlist modificata con successo')
        res.redirect(`/playlist/${req.params.id}`)

    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
    }
}


module.exports.deletePlaylist = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Delete playlist with given id (AUTH required)"
    */
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id)
        res.status(200)
        req.flash('success', 'Playlist eliminata')
        res.redirect('/playlist')
    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
}



module.exports.addSong = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Add song to the playlist with the given id (AUTH required)"
    */
    try {
        const playlist = await Playlist.findById(req.params.id)
        const songId = req.body.songId

        if(songId == null) {
            res.status(500)
            req.flash('error', 'Qualcosa è andato storto')
            return res.redirect('back')
        }

        playlist.tracks.push(songId)
        await playlist.save()
        res.status(200)
        req.flash('success', 'Canzone aggiunta alla playlist')
        res.redirect('back')
    } catch (error) {
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
        console.log(error)
    }
}

module.exports.removeSong = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Remove song from the playlist with given id"
    */
    try {
        const playlist = await Playlist.findById(req.params.id)
        const songId = req.body.songId
        const index = playlist.tracks.indexOf(songId)
        if (index > -1) { //if found
            playlist.tracks.splice(index, 1); 
        }
        await playlist.save()
        res.status(200)
        req.flash('success', 'Canzone rimossa dalla playlist')
        res.redirect('back')
        
    } catch (error) {
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
        console.log(error)
    }
}

module.exports.follow = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Follow playlist with the given id"
    */
    try {
        const user = await User.findById(req.user.id)
        const playlist = await Playlist.findById(req.params.id)

        if(playlist == null) {
            res.status(500)
            req.flash('error', 'Qualcosa è andato storto')
            return res.redirect('back')
        }
    
        if (!user.saved_playlists.includes(req.params.id)) {
                user.saved_playlists.push(req.params.id)
                playlist.followers.push(req.user.id)
                await user.save()
                await playlist.save()
            } else {
                res.status(500)
                req.flash('error', 'Hai già salvato questa playlist')
                res.redirect('back')
            }
        req.flash('success', 'Playlist salvata')
        res.status(200)
        res.redirect('back')
    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
    
}


module.exports.unfollow = async function(req, res) {
    /*
    #swagger.tags = ["Playlist"]
    #swagger.summary = "Unfollow playlist with the given id"
    */
    try {
        const user = await User.findById(req.user.id)
        const playlist = await Playlist.findById(req.params.id)

        if(playlist == null) {
            res.status(500)
            req.flash('error', 'Qualcosa è andato storto')
            return res.redirect('back')
        }
    
        if (user.saved_playlists.includes(req.params.id)) {
            const index = user.saved_playlists.indexOf(req.params.id)
            if (index > -1) { //if found
                user.saved_playlists.splice(index, 1); 
                const userIndex = playlist.followers.indexOf(req.user.id)
                playlist.followers.splice(userIndex, 1)
                await user.save()
                await playlist.save()
            }
        } else {
            res.status(500)
            req.flash('error', 'Non segui questa playlist')
            res.redirect('back')
        }
        res.status(200)
        req.flash('success', 'Playlist rimossa')
        res.redirect('back')
    } catch (error) {
        console.log(error)
        res.status(500)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
    
}