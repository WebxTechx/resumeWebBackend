import express from "express"
import {getUsers,createUser} from "../../controllers/v1/users.controller.js";
const v1Routes = express.Router();

// Define v1 routes
v1Routes.get('/users', createUser);

export {v1Routes}