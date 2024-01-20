import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import path from 'path'; // Rename the alias for the path module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the absolute path to the "uploads" folder
const uploadDir = join(__dirname, '../middleware/uploads');

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // photo: user.photo,
    });
    console.log(user.photo);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const user = await User.findById(_id);

//   if (!user) {
//     res.status(404);
//     throw new Error('User not Found');
//   }

//   let new_image = user.photo;

//   try {
//     if (req.file) {
//       new_image = req.file.filename;
//       if (user.photo) {
//         try {
//           fs.unlinkSync(path.join(uploadDir, user.photo)); // Use the path module alias
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }

//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.photo = new_image;

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     res.status(201).json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       password: updatedUser.password,
//       photo: updatedUser.photo,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let newImage = user.photo; // Initialize newImage with the existing user's photo filename

  try {
    if (req.file) {
      newImage = req.file.filename; // Update newImage with the new filename from req.file
      if (user.photo) {
        try {
          // Construct the full path to the old photo file
          const oldPhotoPath = path.join(uploadDir, user.photo);

          // Check if the old photo file exists before attempting to delete it
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath); // Delete the old photo file
          } else {
            console.log(`Old photo file ${oldPhotoPath} not found.`);
          }
        } catch (error) {
          console.error(`Error deleting old photo file: ${error}`);
        }
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.photo = newImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      photo: updatedUser.photo,
    });
  } catch (error) {
    console.error(`Error updating user profile: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
