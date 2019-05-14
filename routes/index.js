const express = require('express');

const router = express.Router();
const instamojoRouter = require('./instamojo');

router.use('/instamojo', instamojoRouter);

module.exports = router;
