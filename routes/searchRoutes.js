var express = require('express');
var router = express.Router();

const searchController = require('../controllers/searchController')

router.get('/', searchController.renderSearchPage)

router.get('/tracks/:q', searchController.searchTracks)
router.get('/albums/:q', searchController.searchAlbums)
router.get('/artists/:q', searchController.searchArtists)
router.get('/all/:q', searchController.searchAll)
router.get('/track/:id', searchController.searchTrackById)

//mancano le route per cercare utenti e playlist

module.exports = router