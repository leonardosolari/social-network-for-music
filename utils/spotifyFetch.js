const axios = require('axios')

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET


//Genera token spotify
const generateSpotifyToken = async function() {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
  
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`
      },
      data: 'grant_type=client_credentials'
    });
  
    const token = response.data.access_token;
    return token;
}


/**
 * Wrapper per fetch alle API di spotify con inserimento automatico del token
 * @param {string} url - Spotify endpoint's url
 * @param {Object} options - Options for http request
 * @returns Promise representing the request's response
 */
const fetchWithToken = async function(url, options = {}) {
    const token = await generateSpotifyToken()

    const config = {
        headers: {
            Authorization: 'Bearer ' + token,
        },
        params: options
    }

    try {
        const response = await axios.get(url, config)
        return response.data

    } catch (error) {
        console.log(error)
    }
}

/**
 * Esegue ricerca su spotify per il tipo specificato
 * @param {string} type - Item type to search
 * @param {string} name - Name of the item to search
 * @returns Promise representing the search result
 */
const authorizedSearch = async function(type, name) {
    const params = {
        q: `${name}`,
        type: `${type}`,
        limit: 5
    }
    try {
        return await fetchWithToken("https://api.spotify.com/v1/search", params)
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Recupera la lista di tutti i generi disponibili
 * @returns List of all genres
 */
module.exports.fetchGenres = async function() {
    try {
        const response = await fetchWithToken("https://api.spotify.com/v1/recommendations/available-genre-seeds")
        return response.genres
    } catch (error) {
        console.log(error)
    }
}

module.exports.fetchTrackById = async function(id) {
    const url = "https://api.spotify.com/v1/tracks/" + id
    const response = await fetchWithToken(url)
    return response
}

module.exports.fetchAlbumById = async function(id) {
    const url = "https://api.spotify.com/v1/albums/" + id
    const response = await fetchWithToken(url)
    return response
}

module.exports.fetchArtistById = async function(id) {
    const url = "https://api.spotify.com/v1/artists/" + id
    const response = await fetchWithToken(url)
    return response
}

module.exports.fetchArtistTopTracks = async function(id) {
    const url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=IT`
    const response = await fetchWithToken(url)
    return response
}

module.exports.fetchRecommendations = async function(genre, artists) {
    const url = `https://api.spotify.com/v1/recommendations?seed_artists=${artists}&seed-genres=${genre}`
    const response = await fetchWithToken(url)
    return response
}






module.exports.fetchTracks = async function(name) {
    return await authorizedSearch("track", name)
}

module.exports.fetchAlbums = async function(name) {
    return await authorizedSearch("album", name)
}

module.exports.fetchArtists = async function(name) {
    return await authorizedSearch("artist", name)
}

module.exports.fetchAll = async function(name) {
    return await authorizedSearch("track,artist,album", name)
}



