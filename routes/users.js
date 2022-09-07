const router = require('express').Router();
const {
  getCurrentUserInfo,
  updateUserInfo,
} = require('../controllers/users');
const { validateUpdateUserInfo } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.use(auth);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);
router.get('/me', getCurrentUserInfo);

module.exports = router;
