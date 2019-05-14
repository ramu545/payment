const express = require('express');

const router = express.Router();
const instamojoRouter = require('./instamojoV2_1');

router.use('/instamojoV2_1', instamojoRouter);

module.exports = router;
