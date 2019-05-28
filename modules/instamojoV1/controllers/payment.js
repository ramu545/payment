const uuid = require('uuid/v1');
const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const { InstaTransaction } = require('../models');

async function createPayment(payload, appAccessToken) {
  const existingReq = await asyncMongoose.findOneDoc(
      {
          orderId: payload.orderId,
          payStatus: { $ne: 'false' },
      },
      InstaTransaction,
      { 'payReqDetails.id': 1, transactionId: 1, 'payReqDetails.logurl': 1 },
  );
  if (existingReq) {
      console.log('link already active', existingReq);
      return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { link: existingReq.longurl, transactionId: 1 }));
  }
  const reqPayload = {
    purpose: payload.purpose,
    amount: payload.amount,
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

  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const payReqOptions = serviceOptions('instamojoV1', 'CREATE_PAYMENT_REQ', reqPayload, '', [], 'body', extraHeaders);
  console.log('pay request options         ', payReqOptions);
  const payReqResp = await serviceCaller(payReqOptions);
  console.log('payReqCreated');
  let url_string = payReqResp.payment_request.longurl;
  let payUriId = url_string.substring(url_string.lastIndexOf('/') + 1);
  const newTransaction = new InstaTransaction({
    transactionId: uuid(),
    refID: payUriId,
    orderId: payload.orderId,
    payReqDetails: payReqResp,
    payStatus: null,
    payDetails: {},
    refundStatus: null,
    refundDetails: {},
    paymentId: null,
    webhookData: [],
  });
  // trrId = newTransaction.transactionId;
  const saveInfo = await asyncMongoose.saveDoc(newTransaction);
  return Promise.resolve(global.messages.success('PAYMENT_LINK_CREATED', '', { link: payReqResp.payment_request.longurl, transactionId: newTransaction.transactionId }));
}

async function addRedirectV1(data) {
  if (data.payment_status == 'Credit') {
    const payReqUpdate = await asyncMongoose.updateOne(InstaTransaction, { refID: data.payment_request_id }, { 'payReqDetails.id': data.payment_request_id }, { webhookData: data, paymentId: data.payment_id });
    return Promise.resolve(payReqUpdate);
  }
}

async function addWebhookDataV1(data) {
  if (data.status == 'Credit') {
    const payReqUpdate = await asyncMongoose.updateOne(InstaTransaction, { refID: data.payment_request_id }, { 'payReqDetails.id': data.payment_request_id }, { webhookData:{ $push: { data } }, paymentId: data.payment_id });
    return Promise.resolve(payReqUpdate);
  }
}

async function listPayments(payload, appAccessToken) {
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'LIST_OF_PAYMENT_REQ', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function getPaymentRequestDetails(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_REQ_ID', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function PaymentReqIdPaymentID(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id };
  let params_id = {key: "payment_id",value :  payload.payment_id};
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_DETAILS', reqPayload, '', [params,params_id], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function createRefund(payload, appAccessToken){
  const reqPayload = {
    transaction_id: payload.transaction_id,
    payment_id: payload.payment_id,
    type: "QFL",
    body: "Customer isn't satisfied with the quality",
  };
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const payReqOptions = serviceOptions('instamojoV1', 'CREATE_REFUND', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  if(payReqResp.success == true){
    const payReqUpdate = await asyncMongoose.updateOne(InstaTransaction, { refID: payload.transaction_id }, { refundDetails: payReqResp.refund }, { refundStatus: payReqResp.refund.status, paymentId: payReqResp.refund.payment_id });
    return Promise.resolve(payReqUpdate);
  }
}

async function refundList(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  const payReqOptions = serviceOptions('instamojoV1', 'GET_LIST_OF_REFUNDS', reqPayload, '', [], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function detailsOfRefunds(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_DETAILS_OF_A_REFUND', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function paymentdetailId(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'GET_PAYMENT_DETAILS_ID', reqPayload, '', [params], 'body', extraHeaders);
  // console.log('pay request options         ', payReqOptions.uri);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function desablePayments(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'DISABLE_A_REQUEST', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

async function enablePayments(payload, appAccessToken){
  const extraHeaders = { "x-auth-token": appAccessToken['x-auth-token'], "x-api-key": appAccessToken['x-api-key'] };
  const reqPayload = {};
  let params = {key: "id",value : payload.id }
  const payReqOptions = serviceOptions('instamojoV1', 'ENABLE_A_REQUEST', reqPayload, '', [params], 'body', extraHeaders);
  const payReqResp = await serviceCaller(payReqOptions);
  return Promise.resolve(payReqResp);
}

module.exports = { createPayment, addRedirectV1, addWebhookDataV1, listPayments, getPaymentRequestDetails, PaymentReqIdPaymentID, createRefund, refundList, detailsOfRefunds, paymentdetailId, desablePayments, enablePayments };