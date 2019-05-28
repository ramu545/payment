const express = require('express');

const router = express.Router();
const controllers = require('../modules/instamojoV2_1/controllers');

async function instamojoMojoAppTokenCheck(req, res, next) {
  let accessToken;
  let tokenValid = false;
  ({ tokenValid, accessToken } = await controllers.instaAppAccess.checkAppAccessToken());
  if (!tokenValid) {
    ({ access_Token: accessToken } = await controllers.instaApp.login());
  }
  req.accessToken = accessToken;
  next();
}

async function instamojoMojoUserTokenCheck(req, res, next) {
  let accessToken;
  let tokenValid = false;
  let refreshToken = '';
  ({ tokenValid, accessToken, refreshToken } = await controllers
    .instaUserAccess
    .checkUserAccessToken(req.body.userId));
  if (!tokenValid) {
    if (refreshToken !== '') {
      accessToken = await controllers
        .instaUserAccess
        .refreshAccessToken(req.body.userId, refreshToken);
    } else {
      ({ access_Token: accessToken } = await controllers.instaUser.login());
    }
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

// router.use('/user')
//   .post(instamojoMojoAppTokenCheck, (req, res, next) => {
//     controllers.instaUser.signup(req.body, req.accessToken)
//       .then((info) => {
//         res.status(info.status).send(info.data);
//       })
//       .catch(next);
//   })
//   .patch(instamojoMojoUserTokenCheck, (req, res, next) => {
//     controllers.instaUser.updateUserDetails(req.body, req.accessToken)
//       .then((info) => {
//         res.status(info.status).send(info.data);
//       })
//       .catch(next);
//   });

router.post('/paymentReq', instamojoMojoAppTokenCheck, (req, res, next) => {
  controllers.instaPayment.createPaymentReq(req.body, req.accessToken)
    .then((info) => {
      console.log(info);
      res.status(info.status).send(info.data);
    })
    .catch(next);
});

router.post('/instaPayWebhook', (req, res, next) => {
  controllers.instaPayment.addWebhookData(req.body)
    .then((info) => {
      // do nothing
      // res.status(info.status).send(info.data);
    })
    .catch(next);
});

module.exports = router;
