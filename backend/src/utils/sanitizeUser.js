function sanitizeUser(user){
    return {
        id: user.id,
        username: user.username,
        role: user.role
    }
}

module.exports = sanitizeUser