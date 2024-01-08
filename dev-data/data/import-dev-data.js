const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({
  path: 'C:/Users/tvaru/OneDrive/Documents/Studies/College Studies/Semester V/Node - Course/complete-node-bootcamp/4-natours/starter/config.env',
});

console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then((con) => {
  console.log('DB Connection Successful');
});

// Read the JSON File
const tours = JSON.parse(
  fs.readFileSync(
    'C:/Users/tvaru/OneDrive/Documents/Studies/College Studies/Semester V/Node - Course/complete-node-bootcamp/4-natours/starter/dev-data/data/tours.json',
    'utf-8'
  )
);
const users = JSON.parse(
  fs.readFileSync(
    'C:/Users/tvaru/OneDrive/Documents/Studies/College Studies/Semester V/Node - Course/complete-node-bootcamp/4-natours/starter/dev-data/data/users.json',
    'utf-8'
  )
);
const reviews = JSON.parse(
  fs.readFileSync(
    'C:/Users/tvaru/OneDrive/Documents/Studies/College Studies/Semester V/Node - Course/complete-node-bootcamp/4-natours/starter/dev-data/data/reviews.json',
    'utf-8'
  )
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete all the data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
