const jwt = require('jsonwebtoken')

function login(req, res){
    const { username, passworrd } = req.body

    if (username !== 'admin' || passworrd !== 'pass123'){
        return res.status(401).json({error: 'Invalid credentials'})
    }

    const token = jwt.sign(
        {username: 'admin'},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

    res.json({token})
}

module.exports = {
    login
}