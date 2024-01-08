const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userModel = require('./models/userModel');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES

dotenv.config({ path: './config.env' });
// Set Security HTTP Headers
app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit the requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize()); // filter out $ signs to avoid query injection

// Data Sanitization against XSS
app.use(xss()); // removes all malicious html code from request

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'failed',
    message: `Can't find ${req.originalUrl} on this server`,
  }); */

  /* const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'failed';
  err.statusCode = 404; */
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // Always calls the global error handling middleware
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
