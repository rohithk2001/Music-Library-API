const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next); // automatically catch any error and pass it to the error handling middleware
    };
  };
  
  module.exports = catchAsync;
  