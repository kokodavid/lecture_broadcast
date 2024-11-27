export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    if (err.type === 'API_ERROR') {
      return res.status(err.status || 500).json({
        error: err.message,
        code: err.code
      });
    }
  
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };