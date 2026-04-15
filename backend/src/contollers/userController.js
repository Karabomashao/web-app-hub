const sanitizeUser = require('../utils/sanitizeUser')
const { hashPassword } = require('../services/authServices')
const {
  createUser,
  deleteUser,
} = require('../services/userService')

const { 
  getUserById,
  getAllUsers,
  getUserByUsername,
  updateUser,
  updateCompanyDetails
 } = require('../repositories/userRepository')

async function getUsers(req, res) {

  const users = await getAllUsers()
  console.log(sanitizeUser(req.user))

  res.json({
    users: users.map(sanitizeUser),
    authenticatedUser: sanitizeUser(req.user),
  })
}

function getUser(req, res) {
  const requestedUserId = Number(req.params.id)
  const user = getUserById(requestedUserId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    user: sanitizeUser(user),
    authenticatedUser: sanitizeUser(req.user),
  })
}

async function updateUserById(req, res, next) {
  try {
    const requestedUserId = Number(req.params.id)
    const existingUser = await getUserById(requestedUserId)

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const {firstName, lastName, phoneNumber} = req.body

    if (req.body.username !== undefined) {
      const userWithSameUsername = await getUserByUsername(req.body.username)

      if (userWithSameUsername && userWithSameUsername[0].Id !== requestedUserId) {
        return res.status(409).json({ error: 'Username already exists' })
      }
    }

    const updatedUser = await updateUser(requestedUserId, {firstName, lastName, phoneNumber})
    console.log(updatedUser)

    res.json({
      message: 'User updated',
      user: sanitizeUser(updatedUser),
      authenticatedUser: sanitizeUser(req.user),
    })
  } catch (error) {
    next(error)
  }
}

async function updateCompanyByUserId(req, res){
  
  try{
      const requestedUserId = Number(req.params.id)
      const existingUser = await getUserById(requestedUserId)
      
      if (!existingUser || existingUser.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      const {
        companyName, 
        industrySector, 
        phoneNumber,
        physicalAddress,
        numberOfEmployees,
        companyEmail
      } = req.body
      
      const updatedDetails = await updateCompanyDetails(
        requestedUserId,
        {
          companyName,
          industrySector,
          phoneNumber,
          physicalAddress,
        numberOfEmployees,
        companyEmail
      }
    )
    
    res.json({
      message: 'Company profile updated',
    })
  }catch(error){
    console.log({error: error})
    res.status(500).json({error: error})
  }
}

  function deleteUserById(req, res) {
    const requestedUserId = Number(req.params.id)
    const deletedUser = deleteUser(requestedUserId)

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({
      message: 'User deleted',
      user: sanitizeUser(deletedUser),
      authenticatedUser: sanitizeUser(req.user),
    })
  }

async function createUserByAdmin(req, res, next) {
  try {
    const { username, password, role } = req.body

    const existingUser = await getUserByUsername(username)

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = createUser({
      username,
      password: hashedPassword,
      role,
    })

    res.status(201).json({
      message: 'User created',
      user: sanitizeUser(newUser),
      authenticatedUser: sanitizeUser(req.user),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUserById,
  deleteUserById,
  createUserByAdmin,
  updateCompanyByUserId
}