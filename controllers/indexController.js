const getSpotifyInfo = require('../utils/getSpotifyInfo')
const User = require('../models/User')
const Playlist = require('../models/Playlist')

module.exports.renderHomePage = async function (req, res) {
    /*
    #swagger.summary = "Render home page"
    */
    try {
        if (req.user) {
            const user = await User.findById(req.user.id)
            const results = await getSpotifyInfo.getRecommendations(user.favorite_genres[0], user.favorite_artists[Math.floor(Math.random() * user.favorite_artists.length)])
            const playlist = await Playlist.find({private: false})
            res.render('index', {showRecommendations: true, tracks: results, playlist: playlist})
        } else {
            res.render('index', {showRecommendations: false})
        }
    } catch (error) {
        console.log(error)
    }

}