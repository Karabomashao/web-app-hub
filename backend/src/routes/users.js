const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const requireSelf = require('../middleware/requireSelf')
const requireRole = require('../middleware/requireROle')
const users = require('../data/users')
const sanitizeUser = require('../utils/sanitizeUser')

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

router.post('/', requireAuth, requireRole('admin'), (req, res) =>{
    res.json({
        message: 'User created',
        data: req.body,
        authenticateUser: req.user
    })
})

module.exports = router
