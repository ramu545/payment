const uuid = require('uuid/v1');
const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const { InstaTransaction } = require('../models');

/* eslint-disable no-unused-expressions */
async function createPaymentReq(payload, appAccessToken) {
  const existingReq = await asyncMongoose.findOneDoc(
    {
      outletId: payload.outletId,
      orderId: payload.orderId,
      payStatus: { $ne: 'false' },
    },
    InstaTransaction,
    { 'payReqDetails.id': 1, transactionId: 1, 'payReqDetails.logurl': 1 },
  );
  if (existingReq) {
    console.log('link already active');
    return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { paymentLink: existingReq.longurl, transactionId: 1 }));
  }
  // no previous transaction
  console.log('creating new payment link');
  const reqPayload = {
    purpose: payload.purpose,
    amount: payload.amount,
    webhook: payload.webhook,
    allow_repeated_payments: 'False',
  };
  payload.buyerName && (reqPayload.buyer_name = payload.buyerName);
  payload.email && (reqPayload.email = payload.email);
  payload.phone && (reqPayload.phone = payload.phone);
  payload.redirectUrl && (reqPayload.redirect_url = payload.redirectUrl);
  payload.sendEmail && (reqPayload.send_email = payload.sendEmail);
  payload.sendSms && (reqPayload.send_sms = payload.sendSms);

  const extraHeaders = { Authorization: `Bearer ${appAccessToken}` };
  const payReqOptions = serviceOptions('instamojo', 'CREATE_PAYMENT_REQ', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  console.log('payReqCreated');
  const newTransaction = new InstaTransaction({
    transactionId: uuid(),
    outletId: payload.outletId,
    orderId: payload.orderId,
    payReqDetails: payReqResp,
    payStatus: null,
    payDetails: {},
    refundStatus: null,
    refundDetails: {},
  });
  const saveInfo = await asyncMongoose.saveDoc(newTransaction);
  console.log(saveInfo);
  return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { link: payReqResp.longurl }));
}

module.exports = { createPaymentReq };
