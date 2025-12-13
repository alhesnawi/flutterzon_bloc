const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({path : path.join(__dirname, '..' , 'config.env')});

const userName = process.env.DB_USERNAME;
const password = encodeURIComponent(process.env.DB_PASSWORD);
const DB = `mongodb+srv://${userName}:${password}@e-store.yuyhuo4.mongodb.net/?retryWrites=true&w=majority&appName=E-store`;

console.log('Username:', userName);
console.log('Password:', password);
console.log('Connection String:', DB);

mongoose.connect(DB)
  .then(() => {
    console.log('✓ MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch((e) => {
    console.log('✗ MongoDB Connection Failed:');
    console.log(e);
    process.exit(1);
  });
