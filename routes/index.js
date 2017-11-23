const express = require('express');
const router = express.Router();

let nliController = require('../src/nli-gateway/controllers/nli-controller');

/* GET home page. */
router.get('/', (req, res, next) => res.render('index'));

// API.
router.get('/api/fetch', nliController.get);

module.exports = router;
