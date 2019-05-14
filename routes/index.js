const express = require('express');

const router = express.Router();
const instamojoRouter = require('./instamojoV2_1');

const testWebHook = require('./testWebhook');

router.use('/instamojoV2_1', instamojoRouter);

router.use('/webhook', testWebHook);

module.exports = router;
