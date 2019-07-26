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
  } else if (err.name === 'InvalidFileType') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'MulterError' & err.message === 'File too large'){
    return res.status(400).json({ error: `${err.message}, maximum file size 1MB` });
  }

  next(err);
};

const unknownEndpointHandler = (req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer')) {
    req.token = auth.substring(7);
  }

  next();
};

module.exports = { errorHandler, tokenExtractor, unknownEndpointHandler };