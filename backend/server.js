const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./src/routes/users')
const authRouter = require('./src/routes/auth')


app.use(cors({
    origin: 'http://localhost:5173'
}))

//Add JSON body parsing middleware (built in middlware function (express.json()))
app.use(express.json())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRouter)

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

// Add a dynamic route
// app.get('/users/:id', (req, res) => {
//     res.send(`User Id : ${req.params.id}`)
// })

app.get('/search', (req, res) => {
    res.send(`Search term : ${req.query.q}` )
})

// app.post('/users', (req, res) => {
//     res.json({
//         message: "User created",
//         data: req.body
//     })
// })

app.use('/api/users', userRouter)

app.use((req, res) => {
    res.status(404).send("Not Found")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: "something broke"})
})

app.listen(port, () => {
  console.log(`Backend app listening on port http://localhost:${port}`)
})
