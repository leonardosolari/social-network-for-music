const getSpotifyInfo = require('../utils/getSpotifyInfo')
const User = require('../models/User')

module.exports.renderHomePage = async function (req, res) {
    /*
    #swagger.summary = "Render home page"
    */
    try {
        if (req.user) {
            const user = await User.findById(req.user.id)
            const results = await getSpotifyInfo.getRecommendations(user.favorite_genres[0], user.favorite_artists[0])
            res.render('index', {showRecommendations: true, tracks: results})
        } else {
            res.render('index', {showRecommendations: false})
        }
    } catch (error) {
        console.log(error)
    }

}