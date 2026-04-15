const {authenticateUser} = require('../services/authServices')
const sanitizeUser = require('../utils/sanitizeUser')
const registerUser = require('../repositories/authRepository')

async function login(req, res){
    const { username, password } = req.body
    
    const token = await authenticateUser(username, password)

    if (!token){
        return res.status(401).json({error: 'Invalid credentials'})
    }

    console.log(token)
    res.json(token)
}

async function register(req, res){
    const {
            username, 
            password, 
            role,
            companyName,
            registrationNumber
        } = req.body

    const newUser = await registerUser({username, password, companyName, registrationNumber, role})

    if (!newUser){
        return res.status(409).json({error: 'Username already exits'})
    }

    res.status(201).json(
        {
            message: 'User created',
        }
    )

}

module.exports = {
    login,
    register
}