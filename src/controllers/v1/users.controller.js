import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find(); // Fetch all users from the database

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// Create user
const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, first_name, last_name, password } = req.body;

  // Validate input
  if (!fullName || !email || !first_name || !last_name || !password) {
    return res
      .status(200)
      .json(new ApiResponse(200, "", "fullName and email are required"));
  }

  // Check if the user with the same email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(200)
      .json({ error: "User with this email already exists" });
  }

  // Create a new user
  const newUser = await User.create({
    fullName,
    email,
    first_name,
    last_name,
    password,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(200).json({ error: "Email and Password are required" });
  }

  // check existing user
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, "", "User does not exist"));
  }

  if (!(user && (await user.isPasswordCorrect(password)))) {
    return res
      .status(200)
      .json(new ApiResponse(200, "", "Password entered is not valid"));
  }

  const sanitizedUser = {
    _id: user._id,
    email: user.email,
    uuid: user.uuid,
    token: await user.generateAccessToken(),
  };

  if (user && (await user.isPasswordCorrect(password))) {
    return res
      .status(200)
      .json(new ApiResponse(200, sanitizedUser, "User loggedin successfully"));
  }
});

export { getUsers, createUser, loginUser };
