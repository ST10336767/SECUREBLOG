// src/server.js
require('dotenv').config(); // load env FIRST

const fs = require('fs');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const path = require('path');
const app = require('./app'); // <-- app should apply helmet/csp, cors, parsers, routes, errors
const { errorHandler } = require("./middleware/errorHandler");
const PORT = process.env.PORT || 5000;

// Accept either MONGO_URI or MONGODB_URI to avoid naming mismatches
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Missing Mongo connection string. Set MONGO_URI (or MONGODB_URI) in .env');
  process.exit(1);
}

// Try to load local SSL certs for HTTPS; fallback to HTTP if not present
const keyPath = path.join(__dirname, '..', 'ssl', 'privatekey.pem');
const certPath = path.join(__dirname, '..', 'ssl', 'certificate.pem');

let serverFactory;
let protoLabel;

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  serverFactory = () => https.createServer(sslOptions, app);
  protoLabel = 'https';
} else {
  serverFactory = () => http.createServer(app);
  protoLabel = 'http';
  console.warn('SSL certs not found in ./ssl; starting HTTP server for development.');
}

// Connect to MongoDB, then start the server
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const server = serverFactory();
    server.listen(PORT, () => {
      console.log(`Server running at ${protoLabel}://localhost:${PORT}`);
    });
  } catch (err) {
    // Typical SRV/DNS issues show up as ENOTFOUND; surface the message clearly
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();  





/*const fs = require('fs');
const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const express = require("express");
const helmet = require("helmet");
require('dotenv').config();
const app = express();

const PORT = process.env.PORT ;

// SSL configuration
const sslOptions = {
  key: fs.readFileSync('./src/ssl/privatekey.pem'),
  cert: fs.readFileSync('./src/ssl/certificate.pem'),
};

// Connect to MongoDB and start the HTTPS server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT+1, () => {
      console.log(`Secure server running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  // Parse JSON and CSP reports sent by the browser.
// WHY: Browsers POST CSP violation reports with content-type application/csp-report.
// We also accept application/json for convenience across browsers.
//app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// 1) Baseline security headers (X-Content-Type-Options, Referrer-Policy, etc.)
//app.use(helmet());

// Example: if you truly need a CDN script and external images and an API:
// const cspDirectives = {
//   defaultSrc: ["'self'"],
//   scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],     // allow one trusted CDN
//   styleSrc:  ["'self'"],                                 // consider adding hashes/nonces if needed
//   imgSrc:    ["'self'", "https://images.unsplash.com"],  // allow a specific image host
//   connectSrc:["'self'", "https://api.example.com"],      // allow your production API
//   frameAncestors: ["'none'"],
// };

// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,       // keep Helmet’s sane defaults (e.g., base-uri 'self')
//     directives: {
//       ...cspDirectives,
//       // WHY: Tell the browser where to POST violation reports so we can review them during the lab.
//       "report-uri": ["/csp-report"],
//     },
//     // WHY: In dev we want to SEE violations without breaking the app.
//     // In production we will enforce (block) instead.
//     reportOnly: process.env.NODE_ENV !== "production",
//   })
// );

// 3) Receive browser violation reports
// WHY: Gives us concrete, inspectable evidence of blocked actions.
// app.post("/csp-report", (req, res) => {
//   console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
//   res.sendStatus(204);
// });

// // Example health route
// app.get("/api/health", (_req, res) => {
//   res.json({ ok: true, ts: new Date().toISOString() });
// });

// app.listen(PORT, () => {
//   console.log(`SecureBlog API running at http://localhost:${PORT}`);
//   console.log(
//     `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
//   );
// });*/