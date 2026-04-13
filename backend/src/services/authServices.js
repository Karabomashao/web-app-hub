const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../data/users')
const generateUserId = require('../utils/generateUserId')
const { getPool } = require('../config/db')
const { getAllUsers } = require('../repositories/userRepository')
const sanitizeUser = require('../utils/sanitizeUser')

async function authenticateUser(username, password) {
  
  const users = await getAllUsers()
  const user = users.find((user) => user.Email === username)

  if (!user) {
    return null
  }

  const passwordMatches = await bcrypt.compare(password, user.PasswordHash)

  if (!passwordMatches) {
    return null
  }

  const token = jwt.sign(
    {
      id: user.Id,
      username: user.Email,
      role: user.Role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    token: token,
    user: sanitizeUser(user)
  }
}

async function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

async function registerUser({ username, password, role = 'user' }) {
  const existingUser = users.find((user) => user.username === username)

  if (existingUser) {
    return null
  }

  const hashedPassword = await hashPassword(password)

  const newUser = {
    id: generateUserId(users),
    username,
    password: hashedPassword,
    role,
  }


  users.push(newUser)

  return newUser
}

module.exports = {
  authenticateUser,
  hashPassword,
  registerUser,
}