const jwt = require('jsonwebtoken')
const {authenticateUser} = require('../services/authServices')

function login(req, res){
    const { username, password } = req.body
    
    const token = authenticateUser(username, password)

    if (!token){
        return res.status(401).json({error: 'Invalid credentials'})
    }

    res.json({token})

}

module.exports = {
    login
}