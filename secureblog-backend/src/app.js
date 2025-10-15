// RESPONSIBLE FOR CONFIGURING AND SETTING UP EXPRESS APPLICAITON INCLUDING:
// MIDDLEWARE, ROUTES, AND SECURITY. NO SERVER LOGIC.


//Import express framework to build web server
const express = require('express');

//import CORS middleware to allow cross-origin requests (e.g- recat front end calling express backend)
const cors = require('cors');

//import helmet to set various secure HTTP headers automatically
const helmet = require('helmet');

//import dotent to load env vars from a .env file into process.env
const dotenv = require('dotenv');

//load env vars (e.g db, port, uri)
dotenv.config();

//create instance of express application
const app = express();

app.set('trust proxy', 1); // '1' means trust the first proxy in front

//Apply helmet middleware to secure app by setting HTTP headers
app.use(helmet());


// and network requests. This blocks inline/eval scripts and all 3rd-party resources by default.
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],   // no inline scripts, no eval, no external CDNs
  styleSrc: ["'self'"],    // no inline styles, no external styles
  imgSrc: ["'self'"],      // images must come from our origin
  connectSrc: ["'self'"],  // fetch/XHR/WebSocket to our origin only
  frameAncestors: ["'none'"], // cannot embed this site in iframes (prevents clickjacking)
  upgradeInsecureRequests: [] // if serving over https, upgrade http->https automatically
};
//adding CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...cspDirectives,
             // WHY: Tell the browser where to POST violation reports so we can review them during the lab.
             "report-uri": ["/csp-report"],
    },
      // WHY: In dev we want to SEE violations without breaking the app.
    // In production we will enforce (block) instead.
    // reportOnly: process.env.NODE_ENV !== "production",
    reportOnly: false,

})
);

//Receive browser violation repoports
app.post("/csp-report", (req,res) => {
    console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
    res.sendStatus(204);
});

// //enable cors
// app.use(cors());

//Step 3 --> addomg MongoDB and JWT
//Secrurity Middlewares
app.use(cors({
    origin: "https://localhost:5173",
     methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//enable express to parse incoming JSOn payloads
app.use(express.json());


//ROUTES
const authRoutes = require("../routes/authRoutes");
const { protect } = require("../middleware/authMiddleware");

app.use("/api/auth", authRoutes);

//Example protected route
app.get("/api/protected", protect, (req,res) => {
    res.json({
        message: `Welcome, user ${req.user.id}!`,
        timestamp: new Date()
    });
});

//Added ofr RBAC and using routes for post
const postRoutes = require("../routes/postRoutes");
app.use("/api/posts", postRoutes);

//added for comments
const commentRoutes = require("../routes/commentRoutes");
app.use("/api/comments", commentRoutes);


//Define simple route at root url to confirm server runs
app.get('/', (req, res) => {
    res.send("Secure blog API is running")
});

//added
app.get('/test', (req,res) =>{
    res.json({message: "This is secure Blog JSON response"});
}
);

//testing for errors -- temp
app.use((err, req, res, next) => {
  console.error(err.stack);  // <-- shows full error in te  rminal
  res.status(500).send(err.message);
});

app.get('/health', (req, res) => {
    res.status(200).json({status:'ok'});
});


//export app so can be used in server .js
module.exports = app;