import { v4 as uuidv4 } from "uuid";

// Function to generate a new UUID
const generateUUID = () => {
  return uuidv4();
};

export { generateUUID };
