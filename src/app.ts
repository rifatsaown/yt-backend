import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/*------------- Middleware Section ----------------*/
// CORS config
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
));

// express middleware for parsing json and urlencoded request body and static files
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Cokie parser middleware
app.use(cookieParser());

/*------------- Middleware Section End----------------*/


export { app };