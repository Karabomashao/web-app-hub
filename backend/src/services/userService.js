const users = require('../data/users')
const generateUserId = require('../utils/generateUserId')


function getAllUsers(){
    return users
}

function getUserById(id){
    return users.find((user) =>{
        user.id == id
    })
}

function getUserByUsername(username){
    return users.find((user) => {
        user.username === username 
    })
}

function createUser({username, password, role}){
    const newUser = {

        id: generateUserId(users),
        username,
        password,
        role: role || 'user'
    }

    users.push(newUser)
    return newUser
}

function updateUser(id, updates){
    
    const user = users.find((user) => user.id === id)

    if (!user){
        return null
    }

    if (updates.username !== undefined){
        user.username === updates.username
    }

    if (updates.password !== undefined){
        user.password === updates.password
    }

    if (updates.role !== undefined){
        user.role === updates.role
    }

    return user

}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser
}