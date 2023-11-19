import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database

    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create user
const createUser = async (req, res) => {
  const { fullName, email, first_name, last_name, password } = req.body;

  try {
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
    const newUser = new User({
      fullName,
      email,
      first_name,
      last_name,
      password,
    });

    await newUser.save();

    res
      .status(201)
      .json(new ApiResponse(201, newUser, "User created successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: error.errors || [],
    });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
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
        .json(
          new ApiResponse(200, sanitizedUser, "User loggedin successfully")
        );
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: error.errors || [],
    });
  }
};

export { getUsers, createUser, loginUser };
