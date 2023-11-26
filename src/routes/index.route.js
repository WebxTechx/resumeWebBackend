import express from "express";
const mainRouter = express.Router();

// Import the v1 routes
import router from "./v1/v1.route.js";

// Use the v1 routes
mainRouter.use("/v1", router);

export default mainRouter;
