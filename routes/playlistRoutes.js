const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController')
const { ensureAuth } = require('../middleware/ensureAuth')
const { ensureOwner } = require('../middleware/ensureOwner')

router.route('/create')
    .get(ensureAuth, playlistController.renderCreate)
    .post(ensureAuth, playlistController.create)

router.route('/')
    .get(ensureAuth, playlistController.renderUserPlaylists)

router.route('/:id')
    .get(ensureAuth, playlistController.showPlaylist)


module.exports = router;