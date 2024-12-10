#!/usr/bin/node

/**
 * in this module we create express app to create our api
 */


import express from 'express'


// import routes
const endpoints = require('./routes/index.js')

const app = express() // express app
app.use(express.json()) // use express json parser
app.use('/',endpoints) // use imported routes
const port = process.env.port || 5000 // port where express will listen to

// start listening
app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
  });