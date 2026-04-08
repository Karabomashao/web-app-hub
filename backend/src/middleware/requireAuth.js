const jwt = require('jsonwebtoken')

function requireAuth(req, res, next){
    const authHeader = req.get('Authorization')
    
    // console.log(authHeader)
    if(!authHeader){
        return res.status(401).json({error: 'Unauthorized'})
    }
    
    const token = authHeader.replace('Bearer ', '')

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden'})
    }

    // if(!expectedToken){
    //     return res.status(500).json({error: 'Server auth token is not configured'})
    // }

    // const expectedValue = `Bearer ${expectedToken}`
    // if (authHeader !== expectedValue){
    //     return res.status(403).json({error : "Forbidden"})
    // }

    // next()
}

module.exports = requireAuth