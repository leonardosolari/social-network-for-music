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
        const spotifyResponse = await spotifyFetch.fetchTrackById(id)
        const track = spotifyParser.filterTrackFields(spotifyResponse)
        return track
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAlbumById = async function(id) {
    try {
        const spotifyResponse = await spotifyFetch.fetchAlbumById(id)
        const album = spotifyParser.filterAlbumFields(spotifyResponse)
        return album
    } catch (error) {
        console.log(error)
    }
}

module.exports.getArtistById = async function(id) {
    try {
        const spotifyResponse = await spotifyFetch.fetchArtistById(id)
        const artist = spotifyParser.filterArtistFields(spotifyResponse)
        const trackResponse = await spotifyFetch.fetchArtistTopTracks(id)
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

module.exports.getRecommendations = async function (genre, artists) {
    try {
        const spotifyResponse = await spotifyFetch.fetchRecommendations(genre, artists)
        const tracks = []
        for (let track of spotifyResponse.tracks) {
            tracks.push(spotifyParser.filterTrackFields(track))
        }
        return tracks
    } catch (error) {
        console.log(error)
    }
}

module.exports.getSpotifyTopGlobal = async function() {
    try {
        const spotifyResponse = await spotifyFetch.fetchPlaylistById("37i9dQZEVXbMDoHDwVN2tF")
        const trackObjects = []

        for (let i = 0; i < 20; i++) {
            trackObjects.push(spotifyResponse.tracks.items[i])
        }

        const results = []

        for (let track of trackObjects) {
            results.push(track.track.id)
        }

        const tracks = []
        for (let track of results) {
            const result = await this.getTrackById(track)
            tracks.push(result)
        }

        return tracks
       
    } catch (error) {
        console.log(error)
    }
}