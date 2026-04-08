const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const requireSelf = require('../middleware/requireSelf')
const requireRole = require('../middleware/requireROle')
const users = require('../data/users')
const sanitizeUser = require('../utils/sanitizeUser')
const { hashPassword } = require('../services/authServices')
const validateUserBody = require('../middleware/validateUserBody')
const validateUpdateUserBody = require('../middleware/validateUpdateBody')

const {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser
} = require('../services/userService')

router.use((req, res, next) =>{
    console.log(`Users router hit ${req.method} and ${req.originalUrl}`)
    next()
})

router.get('/', requireAuth, requireRole('admin'), (req, res) =>{

    res.json({
        user: getAllUsers(users).map(sanitizeUser),
        authenticateUser: sanitizeUser(req.user)
    })
})

router.get('/:id', requireAuth, requireSelf, (req, res) => {

    const requestedUserId = Number(req.params.id)
    const user = getUserById(requestedUserId)
    

    if(!user){
        return res.status(404).json({error: 'User not found'})
    }

    res.json(
        {
            user: sanitizeUser(user),
            authenticateUser: req.user
        })
    }
)

router.put(
  '/:id',
  requireAuth,
  requireSelf,
  validateUpdateUserBody,
  async (req, res, next) => {
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
)

router.get('/error/test', (req, res, next) =>{
    next(new Error("Test error"))
})


router.post('/', requireAuth, requireRole('admin'), validateUserBody, async (req, res) =>{
    const { username, password , role } = req.body
    
    const existingUser = getUserByUsername(username)

    if (existingUser){
        return res.status(409).json({error : 'Username already exists'})
    }

    const hashedPassword = await hashPassword(password)

    const newUser = createUser(
        {
            username,
            password: hashedPassword,
            role
        })

    users.push(newUser)

    res.status(201).json({
        message: 'User created',
        user: sanitizeUser(newUser),
        authenticatedUser: sanitizeUser(req.user)
    })
})

module.exports = router
