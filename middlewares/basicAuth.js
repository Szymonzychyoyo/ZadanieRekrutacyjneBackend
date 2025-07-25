module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Orders API"');
    return res.status(401).json({ error: 'Unauthorized' });
  }


  const base64Credentials = auth.split(' ')[1];
  const [username, password] = Buffer
    .from(base64Credentials, 'base64')
    .toString('ascii')
    .split(':');


  if (
    username !== process.env.API_BASIC_USER ||
    password !== process.env.API_BASIC_PASS
  ) {
    res.set('WWW-Authenticate', 'Basic realm="Orders API"');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  
  next();
};
