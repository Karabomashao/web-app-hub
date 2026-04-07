const jwt = require('jsonwebtoken')


function authenticateUser(username, password){
    if (username !== 'admin' || password !== 'pass123'){
        return null
    }

    const token = jwt.sign(
        {username: 'admin'},
        process.env.JWT_TOKEN,
        {expiresIn: '1h'}
    )

    return token
}

module.exports = {
    authenticateUser
}