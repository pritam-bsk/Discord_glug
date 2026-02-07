import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import User from "../users/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../../utils/token.js";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some(field => field.trim() === '')) {
        throw new ApiError(400, "All fields are required");
    }

    const exists = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (exists) {
        throw new ApiError(400, "User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
        username: username,
        email: email,
        passwordHash: passwordHash,
    });
    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    res.status(201).json(
        new ApiResponse(201, { id: user._id, username: user.username, email: user.email },
            "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if ([email, username, password].some(field => field.trim() === '')) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const payload = { userId: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await User.updateOne(
        { _id: user._id },
        { $set: { refreshToken: hashedRefresh } }
    );

    res.status(200).json(
        new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully")
    );
})


export { registerUser, loginUser };