function generateUserId(users){
    if (users.length === 0){
        return 1
    }

    const maxId = users.reduce((max, user) => {
        return user.id > max ? user.id : max
    })

    return maxId + 1
}

module.exports = generateUserId