const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()


router.post('/login', (req, res) =>{
    const { username, password } = req.body

    if (username !== 'admin' || password !== pass123){
        return res.status(401).json({error: 'Invalid Credentials'})
    }

    // jwt.sign takes 3 arguments ({username:user_name}, JWT_SECRET, {expiration: duration})
    const token = jwt.sign(
        {username: 'admin'},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

    res.json(token)
})

module.exports = router