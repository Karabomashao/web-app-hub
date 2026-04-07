const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')


router.use((req, res, next) =>{
    console.log(`Users router hit ${req.method} and ${req.originalUrl}`)
    next()
})

router.get('/:id', requireAuth, (req, res) => {

    const requestUserId = Number(req.params.id)


    if (requestUserId !== req.user.id){
        return res.status(403).json({error : 'Forbidden'})
    }

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
