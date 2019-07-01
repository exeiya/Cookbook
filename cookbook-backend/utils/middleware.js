const errorHandler = (err, req, res, next) => {

  if (err.name === 'ValidationError') {
    if (err.errors.username && err.errors.username.kind === 'unique') {
      return res.status(400).json({ error: { type: 'USERNAME_DUPLICATE', message: err.message } });
    }
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Malformatted id' });
  }

  next(err);
};

module.exports = { errorHandler };