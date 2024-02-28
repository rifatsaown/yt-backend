import { Request, Response } from "express";
import fs from "fs";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import IFiles from "../Interface/files";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToCloudinary } from "../utils/cloudinary";


/* 
  Generate the access and refresh token
  This function takes the user ID as an argument and returns an object containing the access token and refresh token 
 */
export const generateAccessAndRefreshToken = async(userID: string) => {
try {
  const user = await User.findById(userID);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken; // Save the refresh token to the DB
  await user?.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };

} catch (error) {
  throw new ApiError(500, "Something went wrong while generating the tokens");
}
};

/* Register User */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Get the user input
  const { fullName, email, userName, password } = req.body;

   // Check if the user input is valid
   if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Get the files from the request object and check if they exist
  const files: IFiles = req.files as IFiles || {};
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

/* Login User */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email,userName, password } = req.body;

  if (!(userName || email)) { // Check if the username or email is provided or not
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ email }, { userName}],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordMatch = await user.verifyPassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid User credentials");
  }

  const { accessToken, refreshToken }=await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.status(200)
  .cookie("refreshToken", refreshToken, options)
  .cookie("accessToken", accessToken, options)
  .json(new ApiResponse(200, {
    user : loggedInUser,
    accessToken,
    refreshToken
  }, "User logged in successfully"));

});

/* Logout User */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
   // Check if req.user is defined
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  )
  // Clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.status(200)
  .clearCookie("refreshToken", options)
  .clearCookie("accessToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"));
  
});

// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as JwtPayload;
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // Send the response
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.status(200)
       .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, {
          accessToken,
          refreshToken
        }, "Access token refreshed successfully"));
  
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// change Current Password
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordMatch = await user.verifyPassword(currentPassword);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid User credentials");
  }
  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  res.status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// update Account Details
export const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
  const {fullName, email} = req.body;

  if(!fullName || !email){
    throw new ApiError(400, "All fields are required");
  }
  // Update the user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { 
        fullName,
        email 
      },
    },
    {new: true}).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Something went wrong while updating the user");
  }

    res.status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

// get Current User
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200)
  .json(new ApiResponse(200, req.user, "User details retrieved successfully"));
});