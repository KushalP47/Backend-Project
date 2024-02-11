import express from "express";
import cors from "cors";    // cross origin resource sharing
import cookieParser from "cookie-parser"; // middleware used in parsing cookies

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN     // will only cater to requests from givrn url
}));

app.use(express.json({limit: "16kb"})); // to limit the size of data which express should accept
app.use(express.urlencoded({extended: true, limit: "16kb"})) // with extended flag, we will get the nested data at deep level
app.use(express.static("public")); // it is a addres folder, where we will keep files which we want to keep in public

app.use(cookieParser());

export { app };