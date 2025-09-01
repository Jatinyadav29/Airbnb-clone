const mongoose = require("mongoose");
const { data } = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
  console.log("Data was initialized");
};

initDB();
