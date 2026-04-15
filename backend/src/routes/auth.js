const express = require('express')
const router = express.Router()
const {login, register} = require('../contollers/authController')
const validateUserBody = require('../middleware/validateUserBody')
const validateLoginBody = require('../middleware/validateLoginBody')
const requireRole = require('../middleware/requireRole')


router.post('/login', validateUserBody, login)
router.post('/register', validateLoginBody, register)

module.exports = router