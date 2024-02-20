import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]), // whenever user registers, this upload() method will first store the images locally
    registerUser    // them we will call the registeruser() function
    );
// http://localhost:8000/api/v1/users/register

export default router;