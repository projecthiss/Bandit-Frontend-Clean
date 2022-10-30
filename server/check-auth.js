const jwt = require('jsonwebtoken')


export const checkAuth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            try {
                const token = req.headers.authorization
                const decoded = jwt.verify(token, process.env.JWT_KEY)
                if (!roles.includes(decoded.userRole)) {
                    throw Error()
                }
                next()
            } catch (error) {
                console.log(error)
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({
                        message: 'Token expired!',
                        action: 'refresh_token',
                    })
                }

                return res.status(401).json({
                    message: 'Auth failed! - Check Access Rights!',
                    action: 'login',
                })
            }
        }
    ]

}