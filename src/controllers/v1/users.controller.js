import {User} from "../../models/user.model.js"

// Get all users
const getUsers = async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const createUser = async (req, res) => {
    const { fullName, email,first_name,last_name,password } = req.body;
  
    try {
      // Validate input
      if (!fullName || !email || !first_name ||!last_name || !password) {
        return res.status(400).json({ error: 'fullName and email are required' });
      }
  
      // Check if the user with the same email already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
  
      // Create a new user
      const newUser = new User({ fullName, email, first_name, last_name, password });
      console.log(newUser);
      await newUser.save();
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
export {getUsers,createUser}