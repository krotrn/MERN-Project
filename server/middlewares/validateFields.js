const validateRequiredFields = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length) {
      res.status(422); // Unprocessable Entity
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
    next();
  };
  
  export { validateRequiredFields };
  