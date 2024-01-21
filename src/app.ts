import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/*------------------------------------------ Middleware Section ----------------------------------------------------*/
// CORS config
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
));

// express middleware for parsing json and urlencoded request body and static files
app.use(express.json({ limit: "16kb" })); // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public")); // serve static files from public folder

// Cokie parser middleware
app.use(cookieParser()); // parse cookie header and populate req.cookies with an object keyed by the cookie names.
/*------------------------------------------- Middleware Section End----------------------------------------------------*/


export { app };