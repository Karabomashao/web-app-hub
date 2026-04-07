const jwt = require('jsonwebtoken')
const {authenticateUser} = require('../services/authServices')

function login(req, res){
    const { username, passworrd } = req.body
    
    const token = authenticateUser(username, passworrd)

    if (!token){
        return res.status(401).json({error: 'Invalid credentials'})
    }

    res.json({token})

}

module.exports = {
    login
}