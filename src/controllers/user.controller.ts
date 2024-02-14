import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import fs from "fs";

// Define the type for the files object
interface Files {
  avater?: Express.Multer.File[];
  coverImage?: Express.Multer.File[];
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Get the user input
  const { fullName, email, userName, password } = req.body;

   // Check if the user input is valid
   if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Get the files from the request object and check if they exist
  const files: Files = req.files as Files || {};
  const avaterLocalPath = files.avater?.[0]?.path;
  const coverImageLocalPath = files.coverImage?.[0]?.path;
  // Check if the avater file is provided
  if (!avaterLocalPath) {
    throw new ApiError(400, "Avater file is required");
  }

  // Check if the user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    fs.unlinkSync(avaterLocalPath); // delete the file from the server
    if (coverImageLocalPath) {
      fs.unlinkSync(coverImageLocalPath); // delete the file from the server
    }
    throw new ApiError(409, "User already exists");
  }

 
  // Upload the avater to cloudinary
  const avater = await uploadToCloudinary(avaterLocalPath);
  // Upload the cover image to cloudinary if it exists
  const coverImage = coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : undefined;
  // Check if the upload was successful
  if (!avater) {
    throw new ApiError(500, "Cloudinary error");
  }

  // Create the user
  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    avater: avater.url,
    coverImage: coverImage?.url || "", // Use optional chaining to avoid 'undefined.url'
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  // Send the response
  res.status(201).json(
    new ApiResponse(201, createdUser, "User created successfully")
  );
});

export { registerUser };
