const users = require('../data/users')
const generateUserId = require('../utils/generateUserId')
const { getPool } = require('../config/db')


async function getAllUsers() {
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .query('SELECT * FROM dbo.Users');

    return result.recordset;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }

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

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) {
    return null
  }

  const deletedUser = users[index]
  users.splice(index, 1)

  return deletedUser
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
}