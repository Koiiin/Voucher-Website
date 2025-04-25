const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const middlewareController = require("../controllers/middlewareController");

router.post("/add", middlewareController.verifyToken, cartController.addToCart);
router.get("/", middlewareController.verifyToken, cartController.getCart);


module.exports = router;