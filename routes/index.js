const express = require('express');

const router = express.Router();
const instamojoRouter = require('./instamojoV2_1');
const instamojoRouterV1 = require('./instamojoV1');
// const testWebHook = require('./testWebhook');
router.use('/instamojoV2_1', instamojoRouter);
router.use('/instamojoV1', instamojoRouterV1);
// router.use('/webhook', testWebHook);
// const testWebHook = require('./testWebhook');
module.exports = router;
