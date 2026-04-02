const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')


router.use((req, res, next) =>{
    console.log(`Users router hit ${req.method} and ${req.originalUrl}`)
    next()
})

router.get('/:id', requireAuth, (req, res) => {
        res.json({User_ID: req.params.id})
    }
)

router.get('/error/test', (req, res, next) =>{
    next(new Error("Test error"))
})

router.post('/', requireAuth, (req, res) =>{
    res.json({
        message: 'User created',
        data: req.body
    })
})

module.exports = router
