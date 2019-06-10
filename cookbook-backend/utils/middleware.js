const errorHandler = (err, req, res, next) => {

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Malformatted id' });
  }

  next(err);
};

module.exports = { errorHandler };