'use strict';

const express = require('express');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'node-express-example running' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  });
}

module.exports = app;
