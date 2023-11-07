const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { ensureAuth } = require('../middleware/ensureAuth')

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
  .get(userController.showUser)

module.exports = router;