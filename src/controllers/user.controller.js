import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };