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

module.exports = getAllUsers