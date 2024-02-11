// importing libraries
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        // connecting with the Database through atlas via mongoose.connect() method
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    }catch(error){
        // Error Handling
        console.error("MongoDB Connection Error:  ", error);
        process.exit(1);
    }
}


export default connectDB;