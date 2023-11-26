import express from "express";
import { checkTokenMiddleware } from "../../middlewares/authTokenVerify.middleware.js";
import { checkIsAdmin } from "../../middlewares/isAdmin.middleware.js";
import {
  getUsers,
  createUser,
  loginUser,
} from "../../controllers/v1/users.controller.js";
const router = express.Router();

// Define v1 routes
router.get("/users", checkTokenMiddleware, checkIsAdmin, getUsers);
router.post("/users", createUser);
// router.post("/users/login", loginUser);
router.route("/users/login").post(loginUser);

export default router;
