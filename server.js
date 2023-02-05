const dotenv = require('dotenv');

const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
//const PASS=q@ii6$_w_g#i.tU;

// 'mongodb+srv://yassmine:q@ii6$_w_g#i.tU@cluster0.cyjnwrg.mongodb.net/natours?retryWrites=true&w=majority,ssl=false';

// const DB = process.env.DATABASE.replace(
// const DB = dbStr.replace('<PASSWORD>', PASS);

///atlas DB
const dbstr = `${process.env.DATABASE}`.replace(
  `<PASSWORD>`,
  `${process.env.DATABASE_PASSWORD}`
);

mongoose
  .connect(dbstr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log(con.conections);
    console.log('connections succifuly created');
  });
console.log(dbstr);

// ///atlas DB
// const dbstr='mongodb+srv://yassmine:q%40ii6%24_w_g%23i.tU@cluster0.cyjnwrg.mongodb.net/natours?retryWrites=true&w=majority'
// mongoose
//   .connect(dbstr, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     //useUnifiedTopology: true,
//   })
//   .then((con) => {
//     console.log(con.conections);
//     console.log('connections succifuly created');
//   });

//local DB  done
// DBL = 'mongodb://127.0.0.1:27017/natours';
// mongoose
//   .connect(DBL, {
//     //.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     //useUnifiedTopology: true,
//   })
//   .then((con) => {
//     console.log(con.conections);
//     console.log('connections succifuly created');
//   });

// console.log(app.get('env'));
// console.log(process.dotenv);

// //cerate document

// const testTour = new Tour({
//   name: 'the park camper ',
//   rating: 4.7,
//   price: 497,
// });

//save change
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR✨✨✨', err);
//   });
//
//start the server
const port = 3000;
//const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening on port${port}...`);
});
