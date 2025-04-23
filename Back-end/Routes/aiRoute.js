const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');   
const { getChatResponse } = require('../controllers/aiController');

router.post('/', getChatResponse); 

module.exports = router;
