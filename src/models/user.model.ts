import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

// Define the interface for the User document
interface IUser extends Document {
  userName: string;
  email: string;
  fullName: string;
  avater: string;
  coverImage?: string;
  watchHistory: Schema.Types.ObjectId[];
  password: string;
  refreshToken?: string;

  // Methods
  verifyPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Define the user schema
const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avater: {
    type: String, // Cloudinary URL
    required: true,
  },
  coverImage: {
    type: String, // Cloudinary URL
  },
  watchHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'Video',
  }],
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

// password hashing middleware before saving to database
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// password verification method
userSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// json web token generation method for access token
userSchema.methods.generateAccessToken = function (): string {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET || '';
  return jwt.sign({
    _id: this._id,
    email: this.email,
    userName: this.userName,
    fullName: this.fullName,
  }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// json web token generation method for refresh token
userSchema.methods.generateRefreshToken = function (): string {
  const secret: Secret = process.env.REFRESH_TOKEN_SECRET || '';
  return jwt.sign({
    _id: this._id,
  }, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// Create the User model using the schema
export { IUser };
export const User = model<IUser>('User', userSchema);