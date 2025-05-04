const router = require("express").Router();
const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');
const passport = require('passport');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post("/refresh", authController.requestRefreshToken) ;

router.post('/logout', middlewareController.verifyToken,  authController.logoutUser) 

router.get('/google', authController.google);
// Google callback
router.get('/google/callback', authController.googleCallback);


module.exports = router;