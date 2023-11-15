import uuid from "uuid";

// Function to generate a new UUID
const generateUUID = () => {
    return uuid.v4();
};

export {generateUUID}