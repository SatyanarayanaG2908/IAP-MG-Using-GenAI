// FILE PATH: backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters'],
            maxlength: [100, 'Full name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,  // This automatically creates an index
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [1, 'Age must be at least 1'],
            max: [120, 'Age cannot exceed 120'],
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        preferredLanguage: {
            type: String,
            required: [true, 'Preferred language is required'],
            enum: ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'],
            default: 'English',
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
            default: '',
        },
        existingConditions: {
            type: [String],
            default: [],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        otp: {
            code: String,
            expiresAt: Date,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };
    return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (candidateOTP) {
    if (!this.otp || !this.otp.code) return false;
    if (new Date() > this.otp.expiresAt) return false;
    return this.otp.code === candidateOTP;
};

// Clear OTP
userSchema.methods.clearOTP = function () {
    this.otp = undefined;
};

// Get public profile
userSchema.methods.getPublicProfile = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        age: this.age,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        preferredLanguage: this.preferredLanguage,
        bloodGroup: this.bloodGroup,
        existingConditions: this.existingConditions,
        createdAt: this.createdAt,
    };
};

// 🔥 FIX: Only add non-duplicate indexes
// email and phone already have indexes from unique: true
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;