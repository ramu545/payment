const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const InstaPayment = new Schema({
  transactionId: String,
  outletId:String,
  orderId: String,
  payReqDetails: Object,
  payDetails: Object,
  webhookData: [Object],
  paymentId: String,
  payStatus: String,
  refundStatus: String,
  refundDetails: Object,
})

module.exports = mongoose.model('instatransactionv1', InstaPayment);
