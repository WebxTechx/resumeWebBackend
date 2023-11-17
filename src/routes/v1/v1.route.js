import express from "express"
import {getUsers,createUser,loginUser} from "../../controllers/v1/users.controller.js";
const v1Routes = express.Router();

// Define v1 routes
v1Routes.get('/users', getUsers);
v1Routes.post('/users', createUser);
v1Routes.post('/users/login', loginUser);

export {v1Routes}