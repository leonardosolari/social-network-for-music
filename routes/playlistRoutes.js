const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController')
const { ensureAuth } = require('../middleware/ensureAuth')
const { ensureOwner } = require('../middleware/ensureOwner')
const { isAuthor } = require('../middleware/isAuthor')

router.route('/create')
    .get(ensureAuth, playlistController.renderCreate)
    .post(ensureAuth, playlistController.create)

router.route('/')
    .get(ensureAuth, playlistController.renderUserPlaylists)

router.route('/:id')
    .get(playlistController.showPlaylist)

router.route('/:id/edit')
    .get(ensureAuth, isAuthor, playlistController.renderEditPlaylist)
    .post(ensureAuth, isAuthor, playlistController.editPlaylist)

router.route('/:id/delete')
    .get(ensureAuth, playlistController.deletePlaylist)

router.route('/:id/add')
    .post(ensureAuth, isAuthor, playlistController.addSong)

router.route('/:id/remove')
    .post(ensureAuth, isAuthor, playlistController.removeSong)

module.exports = router;