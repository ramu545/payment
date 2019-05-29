const uuid = require('uuid/v1');
const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const { InstaTransactionV1 } = require('../models');
const appAccessToken = require('../../../config/config');

const extraHeaders = { "x-auth-token": appAccessToken.AUTH_TOKEN, "x-api-key": appAccessToken.API_KEY };
console.log('access Headers    ', extraHeaders);
async function createPayment(payload) {
  const existingReq = await asyncMongoose.findOneDoc(
    {
      orderId: payload.orderId,
      payStatus: { $ne: 'false' },
    },
    InstaTransactionV1,
    { 'payReqDetails.id': 1, transactionId: 1, payReqUri: 1 },
  );
  console.log('existing request ', existingReq);

  if (existingReq) {
    console.log('link already active', existingReq);
    return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { link: existingReq.payReqUri, transactionId: 1 }));
  }
  const reqPayload = {
    purpose: payload.purpose,
    amount: payload.amount,
    buyer_name: payload.buyer_name,
    webhook: payload.webhook,
    allow_repeated_payments: 'False',
  };
  payload.buyerName && (reqPayload.buyer_name = payload.buyer_name);
  payload.email && (reqPayload.email = payload.email);
  payload.phone && (reqPayload.phone = payload.phone);
  payload.redirectUrl && (reqPayload.redirect_url = payload.redirect_url);
  payload.sendEmail && (reqPayload.send_email = payload.sendEmail);
  payload.sendSms && (reqPayload.send_sms = payload.sendSms);
  console.log('pay load     ==== > ', payload);

  const payReqOptions = serviceOptions('instamojoV1', 'CREATE_PAYMENT_REQ', reqPayload, '', [], 'body', extraHeaders);
  console.log('pay request options         ', payReqOptions);
  const payReqResp = await serviceCaller(payReqOptions);
  console.log('payReqCreated');
  let url_string = payReqResp.payment_request.longurl;
  let payUriId = url_string.substring(url_string.lastIndexOf('/') + 1);
  const newTransaction = new InstaTransactionV1({
    transactionId: uuid(),
    orderId: payload.orderId,
    payReqDetails: payReqResp,
    payReqUri: url_string,
    payStatus: null,
    payDetails: {},
    refundStatus: null,
    refundDetails: [],
    paymentId: null,
    webhookData: [],
  });
  // trrId = newTransaction.transactionId;
  const saveInfo = await asyncMongoose.saveDoc(newTransaction);
  return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { link: payReqResp.payment_request.longurl, transactionId: newTransaction.transactionId }));
}

async function addRedirectV1(data) {
  if (data.payment_status == 'Credit') {
    const payReqUpdate = await asyncMongoose.updateOne(InstaTransactionV1, { refID: data.payment_request_id }, { 'payReqDetails.id': data.payment_request_id }, { webhookData: data, paymentId: data.payment_id });
    return Promise.resolve(payReqUpdate);
  }
}

async function addWebhookDataV1(data) {
  if (data.status == 'Credit') {
    console.log('webhook data     ', data);
    const payReqUpdate = await asyncMongoose.updateOne(InstaTransactionV1, { 'payReqDetails.payment_request.id': data.payment_request_id }, { $push: { webhookData: data }, paymentId: data.payment_id }, {});
    return Promise.resolve(global.messages.success('WEBHOOK_DATA', '', { data: payReqUpdate }));
  }
}

async function listPayments(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'LIST_OF_PAYMENT_REQ', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  // console.log('List of payments',payReqResp); //amount
  return Promise.resolve(global.messages.success('LIST_OF_PAYMENTS', '', { data: payReqResp }));
}

async function getPaymentRequestDetails(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_REQ_ID', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('PAYMENT_REQUEST_DETAILS', '', { data: payReqResp }));
}

async function PaymentReqIdPaymentID(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id };
  let params_id = { key: "payment_id", value: payload.payment_id };
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_DETAILS', reqPayload, '', [params, params_id], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('PAYMENT_REQUEST_DETAILS_DATA', '', { data: payReqResp }));
}

async function createRefund(payload) {
  const reqPayload = {
    transaction_id: payload.transaction_id,
    payment_id: payload.payment_id,
    type: payload.type, //"QFL"
    body: payload.body
  };
  const payReqOptions = serviceOptions('instamojoV1', 'CREATE_REFUND', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  const payReqUpdate = await asyncMongoose.updateOne(InstaTransactionV1, { 'paymentId': payload.payment_id }, { $push: { refundDetails: payReqResp.refund } }, {});
  return Promise.resolve(global.messages.success('CREATE_REFUND', '', { data: payReqUpdate }));
}

async function refundList(payload) {
  const reqPayload = {};
  const payReqOptions = serviceOptions('instamojoV1', 'GET_LIST_OF_REFUNDS', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('LIST_OF_REFUND', '', { data: payReqResp }));
}

async function detailsOfRefunds(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_DETAILS_OF_A_REFUND', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('REFUND_DETAILS', '', { data: payReqResp }));
}

async function paymentdetailId(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_DETAILS_ID', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  console.log('payreqresp       ', payReqOptions);

  return Promise.resolve(global.messages.success('PAYMENT_DETAILS', '', { data: payReqResp }));
}

async function desablePayments(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'DISABLE_A_REQUEST', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('DESABLE_PAYMENT', '', { data: payReqResp }));
}

async function enablePayments(payload) {
  const reqPayload = {};
  let params = { key: "id", value: payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'ENABLE_A_REQUEST', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(global.messages.success('ENABLE_PAYMENT', '', { data: payReqResp }));
}

module.exports = { createPayment, addRedirectV1, addWebhookDataV1, listPayments, getPaymentRequestDetails, PaymentReqIdPaymentID, createRefund, refundList, detailsOfRefunds, paymentdetailId, desablePayments, enablePayments };
