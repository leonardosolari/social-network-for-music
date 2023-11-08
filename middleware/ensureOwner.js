module.exports.ensureOwner = function(req, res, next) {
    if (req.user.id !== req.params.id) {
        req.flash('error', 'Operazione non consentita')
        return res.redirect('/')
    }
    next()
}