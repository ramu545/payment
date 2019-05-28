const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const router = require('./routes');

const router = require('./routesV1/instamojoV1');
app.use('/*', (req, res, next) => {
  console.log(req.originalUrl);
  next();
});


app.use('/', router);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (
    typeof err === 'object'
    && Object.prototype.hasOwnProperty.call(err, 'action')
    && err.action === 'processed'
  ) {
    // eslint-disable-next-line no-param-reassign
    delete err.action;
    const { status } = err;
    // eslint-disable-next-line no-param-reassign
    delete err.status;
    res.status(status).send(err);
  } else {
    const httpError = global.messages.error(err.message);
    console.log(httpError);
    res.status(httpError.status || 500).send(httpError.data);
  }
  next();
});

module.exports = app;
