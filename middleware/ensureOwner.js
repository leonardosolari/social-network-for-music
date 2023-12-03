module.exports.ensureOwner = function(req, res, next) {
    if (req.user.id !== req.params.id) {
        res.status(403)
        req.flash('error', 'Operazione non consentita')
        return res.redirect('/')
    }
    next()
}