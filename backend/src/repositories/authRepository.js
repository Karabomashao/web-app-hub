const { getPool } = require('../config/db')
const { getAllUsers } = require('../repositories/userRepository')
const { hashPassword } = require('../services/authServices')
const { sql } = require('../config/db')

async function registerUser({username, password, companyName, registrationNumber, role = 'user'}){

    
    const users = await getAllUsers()
    const existingUser = users.find((user) => user.username === username)

    if (existingUser){
        return null
    }

    const hashedPassword = await hashPassword(password)
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)

    try{
        await transaction.begin()
        const companyRequest = new sql.Request(transaction)
        const companyResult = await companyRequest
            .input('companyName', sql.NVarChar(225), companyName)
            .input('registrationNumber', sql.NVarChar(100), registrationNumber)
            .query(`
                INSERT INTO Companies (CompanyName, RegistrationNumber)
                OUTPUT INSERTED.companyID
                VALUES (@companyName, @registrationNumber)
                `)
                
        const companyID = companyResult.recordset[0].companyID
        const userRequest = new sql.Request(transaction)
        const result = await userRequest
                .input('email', sql.NVarChar(225), username)
                .input('hashedPassword', sql.NVarChar(sql.MAX), hashedPassword)
                .input('role', sql.NVarChar(50), role)
                .input('companyID', sql.Int, companyID)
                .query(`
                    INSERT INTO Users (Email, PasswordHash, Role, CompanyID)
                    VALUES (@Email, @hashedPassword, @role, @companyID)    
                `)

        await transaction.commit()

        return {
            success: true,
            companyID,
            result
        }
    } catch(error){
        await transaction.rollback()
        throw error
    }


}

module.exports = registerUser