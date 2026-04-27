'use strict';

// Central error handler — must be last middleware registered in index.js.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error', status });
}

module.exports = errorHandler;
