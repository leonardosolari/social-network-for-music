const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { ensureAuth } = require('../middleware/ensureAuth')
const { ensureOwner } = require('../middleware/ensureOwner')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.route('/register')
    .get(userController.renderRegister)
    .post(userController.register);

router.route('/login')
  .get(userController.renderLogin)
  .post(userController.login)

router.route('/logout')
  .get(ensureAuth, userController.logout)

router.route('/:id')
  .get(ensureAuth, userController.showUser)

router.route('/edit/:id')
  .get(ensureAuth, ensureOwner, userController.renderEditUser)
  .post(ensureAuth, ensureOwner, userController.editUser)

router.route('/change-password/:id')
  .get(ensureAuth, ensureOwner, userController.renderChangePassword)
  .post(ensureAuth, ensureOwner, userController.changePassword)

  
router.route('/delete/:id')
  .get(ensureAuth, ensureOwner, userController.deleteUser)

router.route('/:id/followPlaylist/:p')
  .get(ensureAuth, ensureOwner, userController.followPlaylist)

  router.route('/:id/unfollowPlaylist/:p')
  .get(ensureAuth, ensureOwner, userController.unfollowPlaylist)

module.exports = router;