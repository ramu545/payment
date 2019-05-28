module.exports = () => ({
  CREATE_PAYMENT_REQ: { path: '/payment-requests/', method: 'post' }, //request for payment
  LIST_OF_PAYMENT_REQ: { path: '/payment-requests/', method: 'get' }, // get all requests
  GET_PAYMENT_REQ_ID: { path: '/payment-requests/:id/', method: 'get' }, // get full payment request Details
  GET_PAYMENT_DETAILS: { path: '/payment-requests/:id/:payment_id/', method: 'get' }, // get Payment details a particular payment request
  CREATE_REFUND: { path: '/refunds/', method: 'post' }, // creating refund
  GET_LIST_OF_REFUNDS: { path: '/refunds/', method: 'get' }, // list of all refunds
  GET_DETAILS_OF_A_REFUND: { path: '/refunds/:id/', method: 'get' }, // refund Details
  GET_PAYMENT_DETAILS_ID: { path: '/payments/:id', method: 'get' }, // payment related to a particular payment request.
  DISABLE_A_REQUEST: { path: '/payment-requests/:id/disable/', method: 'post' },
  ENABLE_A_REQUEST: { path: '/payment-requests/:id/enable/', method: 'post' },
})