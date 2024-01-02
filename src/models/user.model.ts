import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index : true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avater: {
        type: String, // Cloudinary URL
        required: true
    },
    coverImage: {
        type: String, // Cloudinary URL
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }],
    password:{
        type: String,
        required: [true, 'Password is required'],
    }
},{ timestamps: true });

// password hashing middleware before saving to database 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// password verification method
userSchema.methods.verifyPassword = async function(password: string){
    return await bcrypt.compare(password, this.password);
}

// json web token generation method
userSchema.methods.generateAccessToken = function(){
    const secret: Secret = process.env.ACCESS_TOKEN_SECRET || ""; // Provide a default value or handle the case when it is undefined
    return jwt.sign({
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
    },
    secret,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)}
userSchema.methods.generateRefreshToken = function(){
    const secret: Secret = process.env.REFRESH_TOKEN_SECRET || ""; // Provide a default value or handle the case when it is undefined
    return jwt.sign({
            _id: this._id,
    },
    secret,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}

export const User = mongoose.model('User', userSchema);