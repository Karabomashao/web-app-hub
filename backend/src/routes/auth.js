const express = require('express')
const router = express.Router()
const {login} = require('../contollers/authController')


router.post('/login', login)

module.exports = router