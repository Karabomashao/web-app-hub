const {authenticateUser, registerUser} = require('../services/authServices')
const sanitizeUser = require('../utils/sanitizeUser')

async function login(req, res){
    const { username, password } = req.body
    
    const token = await authenticateUser(username, password)

    if (!token){
        return res.status(401).json({error: 'Invalid credentials'})
    }

    res.json({token})

}

async function register(req, res){
    const {username, password, role} = req.body

    const newUser = await registerUser({username, password, role})

    if (!newUser){
        return res.status(409).json({error: 'Username already exits'})
    }

    res.status(201).json(
        {
            message: 'User created',
            user: sanitizeUser(newUser)
        }
    )

}

module.exports = {
    login,
    register
}