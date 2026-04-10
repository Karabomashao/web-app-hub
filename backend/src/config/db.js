const sql = require('mssql')

let pool

async function connectDB() {
  const config = {
    server: process.env.AZURE_SQL_SERVER,
    port: parseInt(process.env.AZURE_SQL_PORT, 10),
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
      type: "azure-active-directory-default",
    },
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000,
  }

  try {
    pool = await sql.connect(config)
    
    console.log("Connected to Azure SQL with Microsoft Entra ID!")

  } catch (error) {
    console.log("Connection failed", error)
    throw error
  }
}

function getPool() {
  return pool
}

module.exports = {
  sql,
  connectDB,
  getPool,
}