const express = require('express');

const router = express.Router();
const controllers = require('../modules/instamojoV1/controllers');

router.post('/createPaymentRequest', (req, res, next) => {
  controllers.instaPayment.createPayment(req.body)
    .then((info) => {
      console.log('payment request data      ------ >>> ', info.data);
      res.status(info.status).send(info.data);
    })
    .catch(next);
}); // Creating Payment Request

router.post('/redirect/', (req, res, next) => {
  console.log('servo url');
  controllers.instaPayment.addRedirectV1(req.body)
    .then((info) => {
      // do nothing
      // res.status(info.status).send(info.data);
    })
    .catch(next);
}); // redirect url get responce 

router.post('/webhook/', (req, res, next) => {
  console.log('servo url');
  controllers.instaPayment.addWebhookDataV1(req.body)
    .then((info) => {
      console.log('data Updated ', info);
      // do nothing
      res.status(info.status).send(info.data);
    })
    .catch(next);
}); // Get Responce From instamojo 


router.get('/listPaymentRequest/', (req, res, next) => {
  controllers.instaPayment.listPayments(req.query)
    .then((info) => {
      console.log('payment request data      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // List Of all Payment Requests

router.get('/PaymentRequestDetails/:id/', (req, res, next) => {
  controllers.instaPayment.getPaymentRequestDetails(req.params)
    .then((info) => {
      console.log('payment request Details      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // Payment request Details with Order_Id

router.get('/PaymentReqIdPaymentID/:id/:payment_id/', (req, res, next) => {
  controllers.instaPayment.PaymentReqIdPaymentID(req.params)
    .then((info) => {
      console.log('payment request Payment_Id      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // Payment Request with Order_Id And Payment_Id

router.post('/createRefundRequest/', (req, res, next) => {
  controllers.instaPayment.createRefund(req.body)
    .then((info) => {
      console.log('payment Create Refund      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // Refund Request Creating 

router.get('/listOfRefunds/', (req, res, next) => {
  controllers.instaPayment.refundList(req.params)
    .then((info) => {
      console.log('payment Refund List      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // get all refunds List 

router.get('/DetailsOfRefunds/:id', (req, res, next) => {
  controllers.instaPayment.detailsOfRefunds(req.params)
    .then((info) => {
      console.log('payment Details of Refund      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); // Get Refund Details only

// router.get('/payments/:id', (req, res, next) => {
//   controllers.instaPayment.paymentdetailId(req.params)
//     .then((info) => {
//       console.log('payment Details      ------ >>> ', info);
//     })
//     .catch(next);
// }); // Payment Details for Id Base

router.post('/paymentsDesable/:id/disable/', (req, res, next) => {
  controllers.instaPayment.desablePayments(req.params)
    .then((info) => {
      console.log('payment Desable      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); //Payment request Desable

router.post('/paymentsEnable/:id/enable/', (req, res, next) => {
  controllers.instaPayment.enablePayments(req.params)
    .then((info) => {
      console.log('payment Enable      ------ >>> ', info);
      res.status(info.status).send(info);
    })
    .catch(next);
}); //Payment request Enable
module.exports = router;
