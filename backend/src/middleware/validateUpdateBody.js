function validateUpdateBody(req, res, next){
  //   const { username, password, role } = req.body

  //   if (
  //       username === undefined &&
  //       password === undefined &&
  //       role === undefined
  //   ){
  //       const error = new Error('At least one field is required')
  //       error.status = 400
  //       return next(error)
  //   }

  // if (username !== undefined && typeof username !== 'string') {
  //   const error = new Error('Username must be a string')
  //   error.status = 400
  //   return next(error)
  // }

  // if (password !== undefined && typeof password !== 'string') {
  //   const error = new Error('Password must be a string')
  //   error.status = 400
  //   return next(error)
  // }

  // if (role !== undefined && !['admin', 'user'].includes(role)) {
  //   const error = new Error('Role must be admin or user')
  //   error.status = 400
  //   return next(error)
  // }

  next()
}

module.exports = validateUpdateBody