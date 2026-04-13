const { getPool } = require('../config/db')
const getAllUsers = require('../repositories/userRepository')
const { hashPassword } = require('../services/authServices')
const { sql } = require('../config/db')

async function registerUser({username, password, role}){

    
    const users = await getAllUsers()
    const existingUser = users.find((user) => user.username === username)

    if (existingUser){
        return null
    }

    const hashedPassword = await hashPassword(password)
    

    const pool = await getPool()

    const result = pool
        .request()
        .input('email', sql.NVarChar(225), username)
        .input('hashedPassword', sql.NVarChar(sql.MAX), hashedPassword)
        .input('role', sql.NVarChar(50), role)
        .query(`
            INSERT INTO Users (Email, PasswordHash, Role)
            VALUES (@email, @hashedPassword, @role)
            `)
        
    return result

}

module.exports = registerUser