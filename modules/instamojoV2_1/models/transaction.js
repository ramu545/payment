const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    transactionId: String,
    outletId: String,
    orderId: String,
    payReqDetails: Object,
    payDetails: Object,
    webhookData: [Object],
    paymentId: String,
    payStatus: String,
    refundStatus: String,
    refundDetails: Object,
  },
);

module.exports = mongoose.model('instatransaction', transactionSchema);
