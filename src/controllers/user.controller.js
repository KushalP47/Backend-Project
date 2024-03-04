import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "SOmething went wrong while generating Access and Refresh Tokens");
    }
}

const registerUser = asyncHandler( async(req, res) => {
    // get User details from frontend
    // validation of data - not empty
    // check if the user already exists - username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar, get the url for it
    // create user object - create entry in db
    // remove password and RefreshToken field from response
    // check for user creation
    // return user

    const { fullName, userName, email, password } = req.body;
    // console.log(fullName, userName, email, password);

    // validate if any field is empty or not
    if([fullName, userName, email, password].some((val) => val?.trim === "")){
        throw new ApiError(400, "All fields are required!!");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if(existedUser){
        console.log(existedUser);
        throw new ApiError(409, "User with email or userName already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }
    console.log("avatarLocalPath: ", avatarLocalPath);
    console.log("coverImageLocalPath: ", coverImageLocalPath);

    const avatar = await fileUpload(avatarLocalPath);
    const coverImage = await fileUpload(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }
    console.log("Avatar: ", avatar);
    console.log("coverImage: ", coverImage);

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        password,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});

const loginUser = asyncHandler( async(req, res) => {

    const {email, userName, password} = req.body;
    
    console.log(email, userName, password);
    console.log(req);
    if(!email && !userName) {
        throw new ApiError(400, "username or email is required!!");
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    });

    if(!user){
        throw new ApiError(400, "user doesn't exists!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Incorrect Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // const loggedInUser = User.findById(user._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: user.toJSON(),
                accessToken,
                refreshToken,
            },
            "User logged in successfully!!"
        )
    )
});

const logoutUser = asyncHandler( async(req, res) => {
    // find the user
    // clear the refreshToken
    // clear the cookie
    await User.findByIdAndUpdate(req.user._id,{
        refreshToken: undefined,
    });
    
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, 
            {},
            "User logged out successfully!!"
        )
    )

});

const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "User not authenticated!!");
    }

    try {
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        if(!decodedRefreshToken){
            throw new ApiError(401, "User not authenticated!!");
        }
    
        const user = await User.findById(decodedRefreshToken._id);
    
        if(!user){
            throw new ApiError(401, "User not authenticated!!");
        }
    
        if(user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "User not authenticated!!");
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
        const options = {
            httpOnly: true,
            secure: true
        };
    
        return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200, 
                {
                    accessToken,
                    refreshToken,
                },
                "Access Token refreshed successfully!!"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "User not authenticated!!");
    }

});

export { registerUser, loginUser, logoutUser, refreshAccessToken };