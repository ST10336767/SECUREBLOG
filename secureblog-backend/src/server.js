//ACTS AS MAIN ENTRY POINT. STARTS APP AND WILL HANDLE THINGS LIKE
// ERROR HANDLING, LOGGINM, DB CONN

//import mongoose  to connect to mongodb
const mongoose = require('mongoose')
//import express app defined in app
require('dotenv').config();
const app = require('./app');

//Configuring to use hTTPS
const https = require('https');
const fs = require('fs');

//load env vars again


//Define th server port if env variable or default to 5000
const PORT = process.env.PORT || 5000;


//added for the http thing (step 2 --> adding SSL)
// ./ --> current folder
// ../ --> parent folder (one folder up)
const sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};

// https.createServer(options, app).listen(PORT, ()=> {
//     console.log(`Secure API running at https:/localhost:${PORT}`);
// });

//Connecting to MongoDb and starting HTTSPs Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        https.createServer(sslOptions, app).listen(PORT, ()=> {
            console.log(`Secure server running at https://localhost:${PORT}`);
            console.log(
    `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
  );
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error: ',err);
    });



// //start express server & listen on defined port
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });