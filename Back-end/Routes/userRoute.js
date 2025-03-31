const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

router.get('/getall', middlewareController.verifyToken, userController.getAllUser);

router.delete('/:id', middlewareController.verifyTokenAndAdAuth, userController.deleteUser);

module.exports = router;
