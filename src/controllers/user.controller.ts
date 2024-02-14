import { Request, Response} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/cloudinary";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // Get the user input
    const { userName, email, fullName, password } = req.body;
    console.log(userName, email, fullName, password);
    
    // Check if the user input is valid
    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existedUser =  User.findOne({
        $or:[{email}, {userName}]
    })
    if(await existedUser){
        throw new ApiError(409, "User already exists");
    }

    // Upload the avater and cover image to cloudinary
    

    const avaterLocalPath = req.files?.avater[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avaterLocalPath){
        throw new ApiError(400, "Avater file is required");
    }

    const avater = await uploadToCloudinary(avaterLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    
    if(!avater || !coverImage){
        throw new ApiError(500, "Cloudinary error");
    }

});

export { registerUser };