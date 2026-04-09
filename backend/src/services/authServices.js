const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../data/users')
const generateUserId = require('../utils/generateUserId')

async function authenticateUser(username, password) {
  const user = users.find((user) => user.username === username)

  if (!user) {
    return null
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return null
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return token
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

  console.log(hashedPassword)

  users.push(newUser)

  return newUser
}

module.exports = {
  authenticateUser,
  hashPassword,
  registerUser,
}