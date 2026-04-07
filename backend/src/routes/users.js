const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const requireSelf = require('../middleware/requireSelf')


router.use((req, res, next) =>{
    console.log(`Users router hit ${req.method} and ${req.originalUrl}`)
    next()
})

router.get('/:id', requireAuth, requireSelf, (req, res) => {

    res.json(
        {
            message:`User ID: ${req.params.id}`,
            authenticateUser: req.user
        })
    }
)

router.get('/error/test', (req, res, next) =>{
    next(new Error("Test error"))
})

router.post('/', requireAuth, (req, res) =>{
    res.json({
        message: 'User created',
        data: req.body,
        authenticateUser: req.user
    })
})

module.exports = router
