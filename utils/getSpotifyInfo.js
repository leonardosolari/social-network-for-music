const spotifyFetch = require('../utils/spotifyFetch')
const spotifyParser = require('../utils/spotifyResponseParser')


/**
 *  GENERAL SEARCH
 */





/**
 * SEARCH BY ID
 */


module.exports.getTrackById = async function(id) {
    try {
        const spotifyResponse = await spotifyFetch.getTrackById(id)
        const track = spotifyParser.filterTrackFields(spotifyResponse)
        return track
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAlbumById = async function(id) {
    try {
        const spotifyResponse = await spotifyFetch.getAlbumById(id)
        const album = spotifyParser.filterAlbumFields(spotifyResponse)
        return album
    } catch (error) {
        console.log(error)
    }
}

module.exports.getArtistById = async function(id) {
    try {
        const spotifyResponse = await spotifyFetch.getArtistById(id)
        const artist = spotifyParser.filterArtistFields(spotifyResponse)
        const trackResponse = await spotifyFetch.getArtistTopTracks(id)
        const artistTopTracks = []
        for (let track of trackResponse.tracks) {
            artistTopTracks.push(spotifyParser.filterTrackFields(track))
        }
        artist.tracks = artistTopTracks
        return artist
    } catch (error) {
        console.log(error)
    }
}