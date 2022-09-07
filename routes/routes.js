const router = require('express').Router();
const { createNewUser, login } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validations');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { PROBLEM_WITH_URL } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignup, createNewUser);
router.post('/signin', validateSignin, login);

router.use('/movies', movieRouter);
router.use('/users', userRouter);

router.use(auth);
router.use('*', (req, res, next) => {
  next(new NotFoundError(`${PROBLEM_WITH_URL} ${req.originalUrl} `));
});

module.exports = router;
