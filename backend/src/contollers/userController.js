const sanitizeUser = require('../utils/sanitizeUser')
const { hashPassword } = require('../services/authServices')
const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
} = require('../services/userService')

async function getUsers(req, res) {

  const users = await getAllUsers()
  console.log(sanitizeUser(req.user))

  res.json({
    users: users.map(sanitizeUser),
    authenticatedUser: sanitizeUser(req.user),
  })
}

function getUser(req, res) {
  const requestedUserId = Number(req.params.id)
  const user = getUserById(requestedUserId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    user: sanitizeUser(user),
    authenticatedUser: sanitizeUser(req.user),
  })
}

async function updateUserById(req, res, next) {
  try {
    const requestedUserId = Number(req.params.id)
    const existingUser = getUserById(requestedUserId)

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updates = {}

    if (req.body.username !== undefined) {
      const userWithSameUsername = getUserByUsername(req.body.username)

      if (userWithSameUsername && userWithSameUsername.id !== requestedUserId) {
        return res.status(409).json({ error: 'Username already exists' })
      }

      updates.username = req.body.username
    }

    if (req.body.password !== undefined) {
      updates.password = await hashPassword(req.body.password)
    }

    if (req.body.role !== undefined) {
      updates.role = req.body.role
    }

    const updatedUser = updateUser(requestedUserId, updates)

    res.json({
      message: 'User updated',
      user: sanitizeUser(updatedUser),
      authenticatedUser: sanitizeUser(req.user),
    })
  } catch (error) {
    next(error)
  }
}

function deleteUserById(req, res) {
  const requestedUserId = Number(req.params.id)
  const deletedUser = deleteUser(requestedUserId)

  if (!deletedUser) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    message: 'User deleted',
    user: sanitizeUser(deletedUser),
    authenticatedUser: sanitizeUser(req.user),
  })
}

async function createUserByAdmin(req, res, next) {
  try {
    const { username, password, role } = req.body

    const existingUser = getUserByUsername(username)

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = createUser({
      username,
      password: hashedPassword,
      role,
    })

    res.status(201).json({
      message: 'User created',
      user: sanitizeUser(newUser),
      authenticatedUser: sanitizeUser(req.user),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUserById,
  deleteUserById,
  createUserByAdmin,
}