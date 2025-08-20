const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signUp);
router.get('/getuserlist', userController.getUsersList)
router.post('/signin', userController.signIn);
router.post('/create', userController.createUser);
router.get('/search', userController.searchUserByName);
router.get('/get/:id', userController.getUserById)
router.delete('/delete/:id', userController.deleteUserById)
router.post('/updateUserById', userController.updateUserById)

module.exports = router;
