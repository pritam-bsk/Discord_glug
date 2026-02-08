import asyncHandler from '../../utils/asyncHandler.js'
import ApiResponse from '../../utils/ApiResponse.js'
import ApiError from '../../utils/ApiError.js'
import User from './user.model.js'

const getUserById = asyncHandler(async (req, res, next) => {
    const { userid } = req.params;
    const user = await User.findById(userid).select('-passwordHash -refreshToken');
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }
    res.json(new ApiResponse(true, 'User fetched successfully', user));
});

export { getUserById };
