const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return conn;
  }
  catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;