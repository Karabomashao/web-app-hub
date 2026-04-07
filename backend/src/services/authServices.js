const jwt = require('jsonwebtoken')
const users = require('../data/users')


function authenticateUser(username, password){
    const user = users.find((user) => {
        return user.username === username && user.password === password 
    })

    if (!user){
        return null
    }

    const token = jwt.sign(
        {id: user.id, username: 'admin'},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )

    return token
}

module.exports = {
    authenticateUser
}