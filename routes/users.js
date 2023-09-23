const router = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUser, updateAvatar, wrongUrl,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.patch('/*', wrongUrl);

module.exports = router;
