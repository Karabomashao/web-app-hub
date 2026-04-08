function requireSelf(req, res, next){
    const requestUserId = Number(req.params.id)


    if (req.user.role === 'admin'){
        return next()
    }

    if (requestUserId !== req.user.id){
        return res.status(403).json({error : 'Forbidden'})
    }

    next()
}

module.exports = requireSelf