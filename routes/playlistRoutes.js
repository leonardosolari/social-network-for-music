const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { ensureAuth } = require('../middleware/ensureAuth')
const { ensureOwner } = require('../middleware/ensureOwner')

router.get()


module.exports = router;