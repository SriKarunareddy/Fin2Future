const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  const response = {
    success: false,
    error: {
      message,
      code: err.code || 'SERVER_ERROR'
    }
  };
  
  if (err.prerequisiteId) {
    response.error.details = {
      prerequisiteId: err.prerequisiteId
    };
  }
  
  if (err.name === 'ValidationError') {
    response.error.message = Object.values(err.errors).map(e => e.message).join(', ');
    response.error.code = 'VALIDATION_ERROR';
    return res.status(400).json(response);
  }
  
  if (err.name === 'CastError') {
    response.error.message = 'Invalid ID format';
    response.error.code = 'INVALID_ID';
    return res.status(400).json(response);
  }
  
  if (err.code === 11000) {
    response.error.message = 'Duplicate entry';
    response.error.code = 'DUPLICATE_ERROR';
    return res.status(400).json(response);
  }
  
  res.status(statusCode).json(response);
};

export default errorHandler;
