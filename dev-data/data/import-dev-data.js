const dotenv = require('dotenv');
//const { json } = require('express');

const fs = require('fs');

const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel');

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

//read file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
