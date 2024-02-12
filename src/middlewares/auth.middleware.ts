import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Express namespace to add custom properties
declare global {
  namespace Express {
    interface Request {
      user?: typeof User; // Use typeof User to refer to the type
    }
  }
}

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Unauthorized Request');
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as JwtPayload;
  
    const user = await User.findById(decodedToken._id).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid Token');
    }
  
    req.user = user; // Now TypeScript knows about the 'user' property
    next();
} 
catch (error: any) {
    throw new ApiError(401, error?.message || 'Unauthorized Request');
}
});
