const spotifyFetch = require('../utils/spotifyFetch')
const spotifyParser = require('../utils/spotifyResponseParser')
const spotifyInfo = require('../utils/getSpotifyInfo')

/**
 * GENERAL SEARCH
 */

module.exports.searchTracks = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getTracks(query)
        const results = spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields)
        res.render('search/searchResults', {tracks: results})
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports.searchAlbums = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getAlbums(query)
        res.send(spotifyResponse.albums.items.map(spotifyParser.filterAlbumFields))
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports.searchArtists = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getArtists(query)
        res.send(spotifyResponse.artists.items.map(spotifyParser.filterArtistFields))
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports.searchAll = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getAll(query)
        const tracks = spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields)
        const albums = spotifyResponse.albums.items.map(spotifyParser.reducedFilterAlbumFields)
        const artists = spotifyResponse.artists.items.map(spotifyParser.filterArtistFields)
        const results = {
            tracks: tracks,
            albums: albums,
            artists: artists
        }
        res.render('search/searchResults', {tracks: results.tracks, albums: results.albums, artists: results.artists})
        
    } catch (error) {
        res.status(500).send(error.message)
        console.log(error)
    }
}










/**
 * SEARCH BY ID
 */

module.exports.searchTrackById = async function(req, res) {
    try {
        const track = await spotifyInfo.getTrackById(req.params.id)
        res.render('search/trackInfo', {track})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


module.exports.searchAlbumById = async function(req, res) {
    try {
        const album = await spotifyInfo.getAlbumById(req.params.id)
        const albumTracks = []

        for (let track of album.tracks) {
            const result = await spotifyInfo.getTrackById(track.id)
            albumTracks.push(result)
        }

        album.tracks = albumTracks
        res.render('search/albumInfo', {album})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

module.exports.searchArtistById = async function(req, res) {
    try {
        const artist = await spotifyInfo.getArtistById(req.params.id)
        res.render('search/artistInfo', {artist})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}










/**
* RENDERING
 */


module.exports.renderSearchPage = function(req, res) {
    res.render('search/searchPage')
}




/**
 * 
 * 
 * 
 *  PROVA PROVA PROVA PROVA
 * 
 * 
 * 
 * 
 */



module.exports.searchAllApi = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getAll(query)
        const tracks = spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields)
        const albums = spotifyResponse.albums.items.map(spotifyParser.reducedFilterAlbumFields)
        const artists = spotifyResponse.artists.items.map(spotifyParser.filterArtistFields)
        const results = {
            tracks: tracks,
            albums: albums,
            artists: artists
        }
        res.send(results)
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports.searchArtistByIdApi = async function(req, res) {
    try {
        const spotifyResponse = await spotifyFetch.getArtistById(req.params.id)
        const artist = spotifyParser.filterArtistFields(spotifyResponse)
        const trackResponse = await spotifyFetch.getArtistTopTracks(req.params.id)
        const artistTopTracks = []
        for (let track of trackResponse.tracks) {
            artistTopTracks.push(spotifyParser.filterTrackFields(track))
        }
        artist.tracks = artistTopTracks
        res.send(artist)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}