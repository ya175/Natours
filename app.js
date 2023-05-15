const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hellow express', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.send('hellow post method');
// });

//      //middleware

//console.log(process.env.NODE_ENV);

//Set security http header
app.use(helmet()); // best to put in the middelware stack

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use(express.static(`${__dirname}/public`));

//limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this api,please try again in 1 hour'
});
app.use('/api', limiter);

//body parser, read data from body to req.body
app.use(express.json({ limit: '10kb' }));

// {    "email":{"$gt":""},
//     "password":"pass1234"
// }
//data sanitization against no sql query injection
app.use(expressMongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevet parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'maxGroupSize',
      'ratingsAverage',
      'ratingQuantity'
    ]
  })
);
//serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//app.use(morgan('dev'));

// app.use((req, res, next) => {
//   console.log('helle from the mddlewARE');
//   next();
// });

//route handlers for users

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can not find${req.originalUrl};`
  // });

  // const err = new Error(`can not find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can not find ${req.originalUrl}on this server`, 404));
});
app.use(globalErrorHandler);
//res.send('tours');
module.exports = app;
//git try 26-4
