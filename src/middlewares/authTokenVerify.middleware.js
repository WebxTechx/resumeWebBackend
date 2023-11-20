import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkTokenMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers["authorization"];
  const decodeToken = token.split(" ")?.[1]?.replace(/"/g, "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  jwt.verify(decodeToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json(new ApiError(401, "", err.message));
    }
    req.user = decoded;

    next();
  });
};

export { checkTokenMiddleware };
