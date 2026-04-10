function requireRole(role){
    return function (req, res, next){
        if (!req.user) {
            return res.status(401).json({error : 'Unauthorized'})
        }

        console.log(req.user)
        console.log("That print is from here")
        if (req.user.role !== role){
            return res.status(403).json({error: 'Forbidden stucks here'})
        }

        next()
    }
}

module.exports = requireRole