const axios = require('axios')

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET


//Genereates spotify token
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
 * Automatically adds auth token in spotify requests
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
 * Performs a request to spotify's search api for the specified type
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
 * Fetches the list of all available genres
 * @returns List of all genres
 */
module.exports.fetchGenres = async function() {
    try {
        return await fetchWithToken("https://api.spotify.com/v1/recommendations/available-genre-seeds")
    } catch (error) {
        console.log(error)
    }
}






module.exports.getTracks = async function(name) {
    return await authorizedSearch("track", name)
}

module.exports.getAlbums = async function(name) {
    return await authorizedSearch("album", name)
}

module.exports.getArtists = async function(name) {
    return await authorizedSearch("artist", name)
}

module.exports.getAll = async function(name) {
    return await authorizedSearch("track,artist,album", name)
}



