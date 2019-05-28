const express = require('express');

const router = express.Router();
const instamojoRouter = require('./instamojoV1');

// const testWebHook = require('./testWebhook');

router.use('/instamojoV1', instamojoRouter);

// router.use('/webhook', testWebHook);

module.exports = router;
