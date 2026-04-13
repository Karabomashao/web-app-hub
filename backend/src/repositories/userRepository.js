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

async function getUserById(id) {

    try{
        const pool = await getPool()

        const result = await pool
            .request()
            .input('id', id)
            .query('SELECT * FROM dbo.Users WHERE Id= @id')
        
        return result.recordset

    } catch (err) {
        console.error("Error fetching users:", err)
        throw err
    }
}


async function getUserByUsername(username){

    try{
        const pool = await getPool()

        const result = await pool
            .request()
            .input('username', username)
            .query('SELECT * FROM dbo.Users WHERE Email = @username')

        return result.recordset
    } catch (err){
        console.log('Error fetching user:', err)
        throw err
    }
}

async function updateUser(id, updates){

    try {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', id)

        let update = []

        if (updates.firstName !== undefined){
            request.input('firstName', updates.firstName)
            update.push("FirstName = @firstName")
        }

        if (updates.lastName !== undefined){
            request.input('lastName', updates.lastName)
            update.push("LastName = @lastName")
        }

        if (updates.phoneNumber !== undefined){
            request.input('phoneNumber', updates.phoneNumber)
            update.push("PhoneNumber = @phoneNUmber")
        }

        const query = `
            UPDATE dbo.Users
            SET ${update.join(', ')}
            WHERE Id = @id
        `

        const result = await request.query(query)
        return result.rowsAffected

    } catch (err) {
        console.error("Error upddating user:", err)
        throw err
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    updateUser
}