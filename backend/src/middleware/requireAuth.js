function requireAuth(req, res, next){
    const authHeader = req.get('Authorization')
    const expectedToken = process.env.API_TOKEN
    

    if(!authHeader){
        return res.status(401).json({error: 'Unauthorized'})
    }

    if(!expectedToken){
        return res.status(500).json({error: 'Server auth token is not configured'})
    }

    const expectedValue = `Bearer ${expectedToken}`
    if (authHeader !== expectedValue){
        return res.status(403).json({error : "Forbidden"})
    }

    next()
}

module.exports = requireAuth