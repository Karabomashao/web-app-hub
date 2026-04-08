function validateUserBody(req, res, next) {
  const { username, password, role } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' })
  }

  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or user' })
  }

  next()
}

module.exports = validateUserBody