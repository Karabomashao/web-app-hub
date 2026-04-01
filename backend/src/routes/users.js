const express = require('express')
const router = express.Router()

router.use((req, res, next) =>{
   console.log(`Users route hit: ${req.method} ${req.originalUrl}`)
   next()
})

router.get('/:id', (req, res, next) => {
        console.log("First handler")
        next()
    },
    (req, res) => {
        res.send(`User ID: ${req.params.id}`)
    }
)



router.get('/error/test', (req, res, next) => {
    next(new Error("Test error"))
})


router.post('/', (req, res) => {
    res.json({
        message: 'User created',
        data: req.body
    })
})

module.exports = router