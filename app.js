const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hellow express', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.send('hellow post method');
// });

//middleware
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development')
{
  app.use(morgan('dev'));
}
// app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('helle from the mddlewARE');
  next();
});

//route handlers for users

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//res.send('tours');
module.exports = app;
