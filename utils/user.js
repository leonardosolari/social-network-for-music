const User = require('../models/User')

module.exports.getUserInfo = async function(req, res) {
    try {
        const user = await User.findById(currrentUser.id)
    } catch (error) {
        console.log(error)
    }
}