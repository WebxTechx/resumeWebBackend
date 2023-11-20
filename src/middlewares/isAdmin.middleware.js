import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkIsAdmin = (req, res, next) => {
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

    if (decoded?.["is_superuser"] !== true) {
      // return res.status(403 ).json({ message: "You are not authorize to access" });
      return res
        .status(403)
        .json(new ApiError(403, "", "You are not authorize to access"));
    }

    req.user = decoded;

    next();
  });
};

export { checkIsAdmin };
