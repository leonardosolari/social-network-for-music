const spotifyFetch = require('../utils/spotifyFetch')
const spotifyParser = require('../utils/spotifyResponseParser')
const spotifyInfo = require('../utils/getSpotifyInfo')
const Playlist = require('../models/Playlist')
const User = require('../models/User')

/**
 * GENERAL SEARCH
 */

module.exports.searchTracks = async function(req,res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Search tracks by query using Spotify API"
    */
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getTracks(query)
        const results = spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields)

        res.format({
            'text/html': function () {
                res.render('search/searchResults', {tracks: results, albums: undefined, artists: undefined, users: undefined, playlist: undefined})
            },
            'application/json': function() {
                res.send(results)
            }
        })
        
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

module.exports.searchAlbums = async function(req,res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Search albums by query using Spotify API"
    */
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getAlbums(query)
        const results = spotifyResponse.albums.items.map(spotifyParser.reducedFilterAlbumFields)

        res.format({
            'text/html': function () {
                res.render('search/searchResults', {tracks: undefined, albums: results, artists: undefined, users: undefined, playlist: undefined})
            },
            'application/json': function() {
                res.send(results)
            }
        })
        
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

module.exports.searchArtists = async function(req,res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Search artists by query using Spotify API"
    */
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getArtists(query)
        const results = spotifyResponse.artists.items.map(spotifyParser.filterArtistFields)

        res.format({
            'text/html': function () {
                res.render('search/searchResults', {tracks: undefined, albums: undefined, artists: results, users: undefined, playlist: undefined})
            },
            'application/json': function() {
                res.send(results)
            }
        })
        
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

module.exports.searchAll = async function(req,res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Search tracks, albums and artists by query using Spotify API. Search users and playlists in the database by query"
    */
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getAll(query)
        const tracks = spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields)
        const albums = spotifyResponse.albums.items.map(spotifyParser.reducedFilterAlbumFields)
        const artists = spotifyResponse.artists.items.map(spotifyParser.filterArtistFields)
        const users = await User.find({ username: { "$regex": req.params.q, '$options' : 'i'} })
        const playlist = await Playlist.find({ 
            $or: [
                {name: { "$regex": req.params.q, '$options' : 'i'}},
                {description : { "$regex": req.params.q, "$options" : "i"}}
            ], 
            private: false
        })
        const results = {
            tracks: tracks,
            albums: albums,
            artists: artists,
            users: users,
            playlist: playlist
        }

        res.format({
            'text/html': function () {
                res.render('search/searchResults', {tracks: results.tracks, albums: results.albums, artists: results.artists, users: results.users, playlist: results.playlist})
            },
            'application/json': function() {
                res.send(results)
            }
        })
        
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}


module.exports.searchUsers = async function(req, res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Get user by query from the database"
    */
    try {
       const users = await User.find({ username: { "$regex": req.params.q, '$options' : 'i'} })

       res.format({
        'text/html': function () {
            res.render('search/searchResults', {tracks: undefined, albums: undefined, artists: undefined, users: users, playlist: undefined})
        },
        'application/json': function() {
            res.send(users)
        }
    })
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

module.exports.searchPlaylist = async function(req, res) {
        /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Get playlist by query from the database"
    */
    try {
        const playlist = await Playlist.find({ 
            $or: [
                {name: { "$regex": req.params.q, '$options' : 'i'}},
                {description : { "$regex": req.params.q, "$options" : "i"}}
            ], 
            private: false
        })

        res.format({
            'text/html': function () {
                res.render('search/searchResults', {tracks: undefined, albums: undefined, artists: undefined, users: undefined, playlist: playlist})
            },
            'application/json': function() {
                res.send(playlist)
            }
        })
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}










/**
 * SEARCH BY ID
 */

module.exports.searchTrackById = async function(req, res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Get track by id using Spotify API"
    */
    try {
        const track = await spotifyInfo.getTrackById(req.params.id)
        const userPlaylists = await Playlist.find({author: req.user.id})
        res.format({
            'text/html': function () {
                res.render('search/trackInfo', {track, userPlaylists})
            },
            'application/json': function() {
                res.send(track)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


module.exports.searchAlbumById = async function(req, res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Get album by id using Spotify API"
    */
    try {
        const album = await spotifyInfo.getAlbumById(req.params.id)
        const albumTracks = []
        for (let track of album.tracks) {
            const result = await spotifyInfo.getTrackById(track.id)
            albumTracks.push(result)
        }

        album.tracks = albumTracks
        res.format({
            'text/html': function () {
                res.render('search/albumInfo', {album})
            },
            'application/json': function() {
                res.send(album)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

module.exports.searchArtistById = async function(req, res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Get artist by id using Spotify API"
    */
    try {
        const artist = await spotifyInfo.getArtistById(req.params.id)
        res.format({
            'text/html': function () {
                res.render('search/artistInfo', {artist})
            },
            'application/json': function() {
                res.send(artist)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}




/**
* RENDERING
 */


module.exports.renderSearchPage = function(req, res) {
    /*
    #swagger.tags = ["Search"]
    #swagger.summary = "Render search page"
    */
    res.render('search/searchPage')
}