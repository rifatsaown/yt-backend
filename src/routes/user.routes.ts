import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// Register user route with multer middleware to handle file uploads
router.route("/register").post(upload.fields([
    {
        name: "avater",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);

router.route("/login").post(loginUser); // Public route for login user 
router.route("/refresh-token").post(refreshAccessToken);

// Secure routes
router.route("/logout").post(verifyJWT,logoutUser)


export default router;