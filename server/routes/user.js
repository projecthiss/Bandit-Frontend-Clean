import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import mongoRequests from "../mongoRequests";


export const getSettings = (req, res, next) => {
    mongoRequests.getSettings((err, data) => {
        if(data){
            return res.status(200).json(data)
        }
        else{
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
    })
}

export const login = (req, res, next) => {
    //bcrypt.hash("MontyPython", 13, (err, hash) => {

    mongoRequests.getUser(req.body.username, (err, data) => {
        if (!data) {
            return res.status(404).json({
                message: 'user nicht gefunden!',
            })
        }
        mongoRequests.getPasswordhash(req.body.username, (pwError, pwData) => {
            if (pwError) {
                return res.status(401).json({ message: 'Auth failed' })
            }

            bcrypt.compare(req.body.password, pwData, (bcryptErr, result) => {
                if (bcryptErr || !result) {
                    return res.status(401).json({
                        message: 'Auth failed',
                    })
                }
                return responseJWT(
                    res,
                    'User succesfully logged in',
                    200,
                    req.body.username,
                    data.accessRights,
                    data.userIntID
                )
            })
        })
    })
}
const responseJWT = (res, message, resCode, username, userRole, userIntID) => {
    const token = jwt.sign(
        {
            username: username,
            userRole: userRole,
            userIntID : userIntID
        },
        process.env.JWT_KEY,
        {
            expiresIn: '3h',
        }
    )
    return res.status(resCode).json({
        message: message,
        userRole: userRole,
        jwt: token,
    })
}
export const getUserIntID = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    return decoded.userIntID
}
export const getUsername = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    return decoded.username
}