const Playlist = require('../models/Playlist')

module.exports.isAuthor = async function(req, res, next) {
    const playlist = await Playlist.findById(req.params.id)
    if (playlist.author != req.user.id) {
        res.status(403)
        req.flash('error', 'Operazione non consentita')
        return res.redirect('/')
    }
    next()
}