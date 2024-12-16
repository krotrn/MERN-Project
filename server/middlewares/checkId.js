import { isValidObjectId } from "mongoose";

/**
 * Middleware to validate MongoDB ObjectId in request parameters.
 */
const checkId = (req, res, next) => {
    const { id } = req.params;

    // Check if the provided id is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            status: "fail",
            message: `Invalid ObjectId: '${id}'`,
        });
    }

    next(); // Proceed to the next middleware or route handler
};

export default checkId;
