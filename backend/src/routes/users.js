const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const requireSelf = require('../middleware/requireSelf')
const requireRole = require('../middleware/requireRole')
const validateUserBody = require('../middleware/validateUserBody')
const validateUpdateUserBody = require('../middleware/validateUpdateBody')
const {
  getUsers,
  getUser,
  updateUserById,
  updateCompanyByUserId,
  deleteUserById,
  createUserByAdmin,
} = require('../contollers/userController')

router.use((req, res, next) => {
  console.log(`Users route hit: ${req.method} ${req.originalUrl}`)
  next()
})

router.get('/', requireAuth, requireRole('admin'), getUsers)
router.get('/:id', requireAuth, requireSelf, getUser)
router.put('/:id', requireAuth, requireSelf, validateUpdateUserBody, updateUserById)
router.put('/company/:id', requireAuth, validateUpdateUserBody, updateCompanyByUserId)
router.delete('/:id', requireAuth, requireSelf, deleteUserById)
router.post('/', requireAuth, requireRole('admin'), validateUserBody, createUserByAdmin)

module.exports = router