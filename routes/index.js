const express = require('express');
const router = express.Router();

let nliController = require('../src/nli-gateway/controllers/nli-controller');

/* GET home page. */
router.get('/', nliController.get);

module.exports = router;
