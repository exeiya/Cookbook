const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    if (err.errors.username && err.errors.username.kind === 'unique') {
      return res.status(400).json({ error: { type: 'USERNAME_DUPLICATE', message: err.message } });
    }
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Malformatted id' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer')) {
    req.token = auth.substring(7);
  }

  next();
};

module.exports = { errorHandler, tokenExtractor };