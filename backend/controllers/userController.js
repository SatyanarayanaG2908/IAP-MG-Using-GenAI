// FILE PATH: backend/controllers/userController.js

const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/update
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = [
            'firstName',
            'lastName',
            'phone',
            'age',
            'language',
            'bloodGroup',
            'medicalConditions',
        ];

        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getPublicProfile(),
        });
    } catch (error) {
        next(error);
    }
};
