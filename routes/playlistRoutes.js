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

router.route('/:id/edit')
    .get(playlistController.renderEditPlaylist)
    .post(playlistController.editPlaylist)

router.route('/:id/delete')
    .get(playlistController.deletePlaylist)

router.route('/:id/add')
    .post(playlistController.addSong)

router.route('/:id/remove')
    .post(playlistController.removeSong)

module.exports = router;