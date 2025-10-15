const { default: rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { skipMiddlewareFunction } = require("mongoose");

//Site: https://www.npmjs.com/package/express-rate-limit

const limiter = rateLimit({
    windowsMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {message: "Too many attempts from this IP."},
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
});

const emailLimiter = rateLimit({
    windowsMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {message: "You have tried to login from this email too many times."},
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req.body.email),
    handler: (req,res) => {
        bannedEmails[req.body.email] = Date.now() + 15*60*1000;
        res.status(429).json({
            error: "Too many attempts have been made using this email"
        });
    }
});

const loginLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000 , //-> 15 minutes
    limit: 5, // -> 5 requessts per window -> each IP (per 15 mins)
    standardHeaders: 'draft-8', // 
    message: { message: "Too many login attempts. Try again after 15 mins." },
    legacyHeaders: false, //Disavble x-ratelimit headers
    skipSuccessfulRequests: true,  // dont count successful responses
    keyGenerator: (req, res) => ipKeyGenerator(req.ip),
    //added ->
    handler: (req, res) => {
        bannedIPs[req.ip] = Date.now() + 15*60*1000;
        res.status(429).json({
            error: "Too many login attempts"
        });
    }
    // ipv6Subnet: 56, //??
});

const registerLimiter = rateLimit({
    windowsMs: 10* 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    message: {message: "Too many registrations."},
    keyGenerator: (req,res) => ipKeyGenerator(req.ip),
    // ipv6Subnet: 56
    
});

//Site: https://stackoverflow.com/questions/61563026/how-to-increase-the-blocking-time-period-after-being-rate-limited-using-express

const bannedIPs = {};
const bannedEmails = {};



banner = function(req, res, next) {
  // If the current Date is still before than the unblocking date, 
  // send a 429 message indicating too many requests
  if (bannedIPs[req.ip] >= +new Date()) {
    res.status(429).send("Sorry, too many requests: " + new Date(bannedIPs[req.ip]));
  } else {
    next();
  }
}

bannerEmail = function(req,res,next){
    if(bannedEmails[req.body.email] >= +new Date()){
        res.status(429).send("Too many attempts with this email have been made.")
    }else{
        next();
    }
}


module.exports = {banner, bannerEmail,loginLimiter, registerLimiter, limiter, emailLimiter};