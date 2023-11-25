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

module.exports.renderUserPlaylists = async function(req, res) {
    const userPlaylists = await Playlist.find({collaborators: req.user.id})
    const publicPlaylists = await Playlist.find({private: false})
    res.render('playlist/userPlaylist', {userPlaylists, publicPlaylists})
}

module.exports.showPlaylist = async function(req, res) {
    const playlist = await Playlist.findById(req.params.id)
    const author = await User.findById(playlist.author)
    const username = author.username
    const playlistTracks = []
    for (let trackId of playlist.tracks) {
        const response = await getTrackById(trackId)
        playlistTracks.push(filterTrackFields(response))
    }

    res.render('playlist/showPlaylist', {playlist, playlistTracks, username})

}