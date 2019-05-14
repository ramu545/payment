const express = require('express');

const router = express.Router();
const controllers = require('../modules/instamojoV2_1/controllers');

async function instamojoMojoAppTokenCheck(req, res, next) {
  let accessToken;
  let tokenValid = false;
  ({ tokenValid, accessToken } = await controllers.instaApp.checkAppAccessToken());
  if (!tokenValid) {
    ({ access_Token: accessToken } = await controllers.instaApp.login());
  }
  req.accessToken = accessToken;
  next();
}

router.post('/appLogin', (req, res, next) => {
  controllers.instaApp.login()
    .then((info) => {
      res.status(200).send(info);
    })
    .catch(next);
});

router.post('/userSignup', instamojoMojoAppTokenCheck, (req, res, next) => {
  controllers.instaUser.signup(req.body, req.accessToken)
    .then((info) => {
      res.status(info.status).send(info.data);
    })
    .catch(next);
});

router.post('/paymentReq', instamojoMojoAppTokenCheck, (req, res, next) => {
  controllers.instaPayment.createPaymentReq(req.body, req.accessToken)
    .then((info) => {
      console.log(info);
      res.status(info.status).send(info.data);
    })
    .catch(next);
});

module.exports = router;
