const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.post('/create', userController.createUser);
router.get('/:id', userController.getUserById)
router.delete('/:id', userController.deleteUserById)

module.exports = router;
