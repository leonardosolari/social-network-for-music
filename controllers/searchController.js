const spotifyFetch = require('../utils/spotifyFetch')
const spotifyParser = require('../utils/spotifyResponseParser')

module.exports.searchTracks = async function(req,res) {
    try {
        const query = req.params.q
        const spotifyResponse = await spotifyFetch.getTracks(query)
        res.send(spotifyResponse.tracks.items.map(spotifyParser.filterTrackFields))
        
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
        const albums = spotifyResponse.albums.items.map(spotifyParser.filterAlbumFields)
        const artists = spotifyResponse.artists.items.map(spotifyParser.filterArtistFields)
        const response = {
            tracks: tracks,
            albums: albums,
            artists: artists
        }
        res.send(response)
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports.searchTrackById = async function(req, res) {
    try {
        const spotifyResponse = await spotifyFetch.getTrackById(req.params.id)
        const track = spotifyParser.filterTrackFields(spotifyResponse)
        res.render('search/trackInfo', {track})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}



