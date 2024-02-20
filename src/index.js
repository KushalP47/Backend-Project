// importing libraries
import dotenv from "dotenv";    
import connectDB from "./db/index.js";
import { app } from "./app.js";
console.log("Hello ");
dotenv.config({     // configure dotenv
    path: "./.env"  // set path of env
});

connectDB()     // connecting to DB
.then(() => {   // if successful connection established then start the PORT
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on Port: ", process.env.PORT);
    });
})
.catch((error) => { // Error
    console.log("Connection Failed!!  ", error);
})
    