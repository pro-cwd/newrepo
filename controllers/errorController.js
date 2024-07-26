const errorController = {};

errorController.triggerError = async (req, res, next) => {
  const error = new Error("Intentional error triggered");
  error.status = 500;
  next(error);
};

module.exports = errorController;
