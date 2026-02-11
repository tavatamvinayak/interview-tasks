const express = require('express');

const {
    getCurrentWether, getForecast
} = require('../controllers/weather.controller');

const router = express.Router();

router.get("/weather", getCurrentWether);
router.get('/forecast', getForecast);

module.exports = router;