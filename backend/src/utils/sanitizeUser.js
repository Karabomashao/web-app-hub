function sanitizeUser(user){
    return {
        id: user.Id,
        fistName: user.FirstName,
        lastName: user.LastName,
        username: user.Email,
        role: user.Role,
        phoneNumber: user.PhoneNumber

    }
}

module.exports = sanitizeUser