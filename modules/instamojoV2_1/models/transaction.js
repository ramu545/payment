const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    transactionId: String,
    outletId: '',
    orderId: '',
    payReqDetails: Object,
    payDetails: Object,
    payStatus: String,
    refundStatus: String,
    refundDetails: Object,
  },
);

module.exports = mongoose.model('instatransaction', transactionSchema);
