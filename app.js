require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes');
<<<<<<< HEAD
=======
const cors = require('cors');
const Sentry = require('@sentry/node');
>>>>>>> 70a36bb5e90462dec5cb5cf18b127ff6fe6b5594

const {
  SENTRY_DSN,
  ENVIRONMENT
} = process.env;

Sentry.init({
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
<<<<<<< HEAD
app.use(express.json());

app.use(router);
=======
app.use('/images', express.static('public/images'));

app.use(router);

// Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({ message: `can't find ${req.url}` });
});

// 500 handler
app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});
>>>>>>> 70a36bb5e90462dec5cb5cf18b127ff6fe6b5594

module.exports = app;