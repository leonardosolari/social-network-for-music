var express = require('express');
var router = express.Router();

const searchController = require('../controllers/searchController');
const { ensureAuth } = require('../middleware/ensureAuth');

router.get('/', ensureAuth, searchController.renderSearchPage)

router.get('/tracks/:q', ensureAuth, searchController.searchTracks)
router.get('/albums/:q', ensureAuth, searchController.searchAlbums)
router.get('/artists/:q', ensureAuth, searchController.searchArtists)
router.get('/all/:q', ensureAuth, searchController.searchAll)

router.get('/track/:id', ensureAuth, searchController.searchTrackById)
router.get('/album/:id', ensureAuth, searchController.searchAlbumById)
router.get('/artist/:id', ensureAuth, searchController.searchArtistById)

router.get('/users/:q', ensureAuth, searchController.searchUsers)
router.get('/playlist/:q', ensureAuth, searchController.searchPlaylist)
router.post('/artist/:id/follow', ensureAuth, searchController.followArtist)
router.post('/artist/:id/unfollow', ensureAuth, searchController.unfollowArtist)
router.get('/global', searchController.getTopGlobal)

module.exports = router