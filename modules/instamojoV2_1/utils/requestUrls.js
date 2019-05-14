module.exports = () => ({
  APP_BASED_LOGIN: { path: '/oauth2/token/', method: 'post' },
  USER_BASED_LOGIN: { path: '/oauth2/token/', method: 'post' },
  REFERSH_TOKEN: { path: '/oauth2/token/', method: 'post' },
  USER_SIGNUP: { path: '/v2/users/', method: 'post' },
  UPDATE_USER: { path: '/v2/users/:id/', method: 'patch' },
  UPDATE_BANK: { path: '/v2/users/:id/inrbankaccount/', method: 'put' },
  CREATE_PAYMENT_REQ: { path: '/v2/payment_requests/', method: 'post' },
  GET_PAYMENT_DETAILS: { path: '/v2.1/payments/:id/', method: 'get' },
  GET_PAYMENT_REQ: { path: '/v2/payment_requests/:id/', method: 'get' },
  CREATE_SETTLEMENT: { path: '/v2/payments/:payment_id/settlements/', method: 'post' },
  FULFIL_PAYMENT: { path: '/v2/payments/:payment_id/fulfil/', method: 'post' },
  GET_SETTLEMENT: { path: '/v2/payments/:payment_id/settlements/', method: 'get' },
  CREATE_REFUND: { path: '/v2/payments/:payment_id/refund/', method: 'post' },
  ENABLE_REQUEST: { path: '/v2/payment_requests/:id/enable/', method: 'post' },
  DISABLE_REQUEST: { path: '/v2/payment_requests/:id/disable/', method: 'post' },
  CREATE_ORDER: { path: '/v2/gateway/orders/payment-request/', method: 'post' },
}
);
