const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const requireSelf = require('../middleware/requireSelf')
const requireRole = require('../middleware/requireROle')
const users = require('../data/users')
const sanitizeUser = require('../utils/sanitizeUser')
const generateUserId = require('../utils/generateUserId')

router.use((req, res, next) =>{
    console.log(`Users router hit ${req.method} and ${req.originalUrl}`)
    next()
})

router.get('/:id', requireAuth, requireSelf, (req, res) => {

    const requestedUserId = Number(req.params.id)
    const user = users.find((user) => {
        return user.id === requestedUserId
    })

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

router.get('/error/test', (req, res, next) =>{
    next(new Error("Test error"))
})

router.get('/', requireAuth, requireRole('admin'), (req, res) =>{
    const safeUser = users.map((user) => sanitizeUser(user))

    res.json({
        user: safeUser,
        authenticateUser: req.user
    })
})

router.post('/', requireAuth, requireRole('admin'), (req, res) =>{
    const { username, password , role } = req.body
    
    const existingUser = users.find( (user) => {
        return user.username === username
    })

    if (existingUser){
        return res.status(409).json({error : 'Username already exists'})
    }

    const newUser = {
        id: generateUserId(users),
        username,
        password,
        role: role || 'user'
    }

    users.push(newUser)

    res.json({
        message: 'User created',
        user: sanitizeUser(newUser),
        authenticatedUser: sanitizeUser(req.user)
    })

    
})

module.exports = router
