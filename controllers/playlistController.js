const Playlist = require('../models/Playlist')
const User = require('../models/User')
const {getTrackById} = require('../utils/spotifyFetch')
const {filterTrackFields} = require('../utils/spotifyResponseParser')

module.exports.renderCreate = function(req,res) {
    res.render('playlist/createPlaylist')
}

module.exports.create = async function(req, res) {
    const { name, description, private } = req.body
    try {
        await Playlist.create({
            name: name,
            description: description,
            author: req.user.id, 
            collaborators: [req.user.id],
            private: private,
        })
        req.flash('success', 'Nuova playlist creata, ora puoi aggiungerci delle canzoni')
        res.redirect('/')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('/playlist/create')
    }
}

module.exports.userPlaylists = async function(req, res) {
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
            res.render('playlist/userPlaylist', {userPlaylists, savedPlaylists: savedPlaylists})
        },
        'application/json': function() {
            res.send(response)
        }
    })
}

module.exports.showPlaylist = async function(req, res) {
    try {
        const playlist = await Playlist.findById(req.params.id)
        const author = await User.findById(playlist.author)
        const username = author.username
        const playlistTracks = []
        for (let trackId of playlist.tracks) {
            const response = await getTrackById(trackId)
            playlistTracks.push(filterTrackFields(response))
        }
        
        res.format({
            'text/html': function () {
                res.render('playlist/showPlaylist', {playlist, playlistTracks, username})
            },
            'application/json': function() {
                res.send(playlist)
            }
        })
        
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        //res.redirect('back')
    }
    

}


module.exports.renderEditPlaylist = async function(req, res) {
    const playlist = await Playlist.findById(req.params.id)
    res.render('playlist/editPlaylist', {
        id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        tags: playlist.tags
    })
}



module.exports.editPlaylist = async function(req, res) {
    try {
        const {name, description} = req.body
        const playlist = await Playlist.findByIdAndUpdate(req.params.id, {name, description})
        req.flash('success', 'Playlist modificata con successo')
        res.redirect(`/playlist/${req.params.id}`)

    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
    }
}


module.exports.deletePlaylist = async function(req, res) {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id)
        req.flash('success', 'Playlist eliminata')
        res.redirect('/playlist')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
}



module.exports.addSong = async function(req, res) {
    try {
        const playlist = await Playlist.findById(req.params.id)
        const songId = req.body.songId
        playlist.tracks.push(songId)
        await playlist.save()
        res.redirect('back')
        req.flash('success', 'Canzone aggiunta alla playlist')
    } catch (error) {
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
        console.log(error)
    }
}

module.exports.removeSong = async function(req, res) {
    try {
        const playlist = await Playlist.findById(req.params.id)
        const songId = req.body.songId
        const index = playlist.tracks.indexOf(songId)
        if (index > -1) { //if found
            playlist.tracks.splice(index, 1); 
        }
        await playlist.save()
        req.flash('success', 'Canzone rimossa dalla playlist')
        res.redirect('back')
        
    } catch (error) {
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
        console.log(error)
    }
}

module.exports.follow = async function(req, res) {
    try {
        const user = await User.findById(req.user.id)
        const playlist = await Playlist.findById(req.params.id)
    
        if (!user.saved_playlists.includes(req.params.id)) {
                user.saved_playlists.push(req.params.id)
                playlist.followers.push(req.user.id)
                await user.save()
                await playlist.save()
            } else {
                req.flash('error', 'Hai già salvato questa playlist')
                res.redirect('back')
            }
        req.flash('success', 'Playlist salvata')
        res.redirect('back')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
    
}


module.exports.unfollow = async function(req, res) {
    try {
        const user = await User.findById(req.user.id)
        const playlist = await Playlist.findById(req.params.id)
    
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
            req.flash('error', 'Non segui questa playlist')
            res.redirect('back')
        }
        req.flash('success', 'Playlist rimossa')
        res.redirect('back')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Qualcosa è andato storto')
        res.redirect('back')
    }
    
}