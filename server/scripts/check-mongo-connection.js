#!/usr/bin/env node
// Tests the MONGO_URI connection string in isolation, without booting the
// full server (routes, socket.io, etc.) — useful when debugging a
// connection issue during setup or deployment.
//
// Usage:
//   node server/scripts/check-mongo-connection.js
//
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not found in .env');
  process.exit(2);
}

console.log('Testing Mongo connection to:', uri.replace(/:(.*)@/, ':****@'));

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Mongo connection successful');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Mongo connection error:');
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
