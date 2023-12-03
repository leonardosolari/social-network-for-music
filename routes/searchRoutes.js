var express = require('express');
var router = express.Router();

const searchController = require('../controllers/searchController');
const { ensureAuth } = require('../middleware/ensureAuth');

router.get('/', searchController.renderSearchPage)

router.get('/tracks/:q', searchController.searchTracks)
router.get('/albums/:q', searchController.searchAlbums)
router.get('/artists/:q', searchController.searchArtists)
router.get('/all/:q', searchController.searchAll)

router.get('/track/:id', searchController.searchTrackById)
router.get('/album/:id', searchController.searchAlbumById)
router.get('/artist/:id', searchController.searchArtistById)

router.get('/users/:q', searchController.searchUsers)
router.get('/playlist/:q', searchController.searchPlaylist)
router.post('/artist/:id/follow', ensureAuth, searchController.followArtist)
router.post('/artist/:id/unfollow', ensureAuth, searchController.unfollowArtist)

module.exports = router