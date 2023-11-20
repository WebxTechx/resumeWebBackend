import express from "express";
import { checkTokenMiddleware } from "../../middlewares/authTokenVerify.middleware.js";
import { checkIsAdmin } from "../../middlewares/isAdmin.middleware.js";
import {
  getUsers,
  createUser,
  loginUser,
} from "../../controllers/v1/users.controller.js";
const v1Routes = express.Router();

// Define v1 routes
v1Routes.get("/users", checkTokenMiddleware, checkIsAdmin, getUsers);
v1Routes.post("/users", createUser);
v1Routes.post("/users/login", loginUser);

export { v1Routes };
