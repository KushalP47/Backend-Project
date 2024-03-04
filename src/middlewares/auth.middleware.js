import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler( async(req, res, next) => {

    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        // if user doesn't have access tokens then send error
        if(!accessToken){
            throw new ApiError(401, "User not authenticated!!");
        }
    
        // verify the user by comparing the access tokens
        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
        // adding the user object in the request object
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401, "User not authenticated!!");
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }

});