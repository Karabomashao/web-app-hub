const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

const {getPool} = require('./src/config/db')


const userRouter = require('./src/routes/users')
const authRouter = require('./src/routes/auth')
const { connectDB } = require('./src/config/db')


app.use(cors({
    origin: 'http://localhost:5173'
}))

//Add JSON body parsing middleware (built in middlware function (express.json()))
app.use(express.json())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)


app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.get('/api/health', (req, res) => {
    res.json({message: "Backend is connected"})
})

app.get('/api/about', (req, res) => {
    res.json({message:"This is the about page"})
})

app.post("/data", (req, res) => {
    res.json({received: req.body})
})

app.get('/search', (req, res) => {
    res.send(`Search term : ${req.query.q}` )
})


app.use((req, res) => {
    res.status(404).send("Not Found")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: "something broke"})
})


// async function testConnection(){
//     const pool = await getPool();

//     const result = await pool.request().query(`
//         SELECT
//         DB_NAME() AS databaseName,
//         @@SERVERNAME AS serverName,
//         SCHEMA_NAME() AS schemaName
//         `);

//     console.log(result.recordset[0]);
// }

async function startServer(){
    try{
        await connectDB()

        // await testConnection()

        app.listen(port, () => {
            console.log(`Backend app listening on http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Failed to start server', error)
        process.exit(1)
    }
}

startServer()
