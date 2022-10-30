import mongoRequests from "../mongoRequests"
import {getUserIntID, getUsername} from "./user";
import * as bandit from './bandit'

var request = require('request')
const jwt = require('jsonwebtoken')

const banditURL = process.env.BANDIT_URL


const getOptions = (route, body) => {
    return {
        'method': 'POST',
        'url': banditURL + route,
        'headers': {
            'Authentication': process.env.BANDIT_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
export const getMarkUpFormat = (req, res, next) => {

    request(getOptions('/automaticHighlighting', {frage: req.body.frage.replaceAll("   ", "\n")}), (error, response) => {
        if (error) {
            console.log(error)
        }
        if (response===undefined){
            return res.status(500).json({
                errorMessage: "No Connection to Highlighting"
            })
        }
        if (response.statusCode != 200) {
            //let jsonResponse = JSON.parse(response.body)
            console.log(response)
            console.log("error Highlighting ")

        } else {
            let result = JSON.parse(response.body)
            return res.status(200).json(result)
        }
    })
}
export const saveUserCreatedTicket = (req, res, next) => {
    console.log("saveUserCreatedTicket received")
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.body.ticket.editor= decoded.username
    req.body.ticket.userCreatedTicket = decoded.username
    mongoRequests.saveUserCreatedTicket(req.body.ticket, (err, data)=>{
        if (err){
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
        return res.status(200).json({
            "message": "Ticket saved"
        })

    })
}

export const saveTicket = (req, res, next) => {
    console.log("saveTicket received")
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.body.ticket.editor= decoded.username
    mongoRequests.saveTicket( req.body.ticket, (err, data)=>{
        if (err){
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
        return res.status(200).json({
            "message": "Ticket saved"
        })

    })
}
export const learnAndSavePrediction = (req, res, next) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.body.ticket.editor= decoded.username
    mongoRequests.saveTicket( req.body.ticket, (err, data)=>{
        if (err){
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
        bandit.learnPrediction(req,res,next)
    })
}

export const getTicketsByID = (req, res, next) => {
    mongoRequests.getTicketByID(req.body._id, (err, data) => {
        if (data) {
            return res.status(200).json(data)
        } else {
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
    })
}
export const getTickets = (req, res, next) => {
    mongoRequests.getTickets(getUserIntID(req.headers.authorization), getUsername(req.headers.authorization), (err, data) => {
        if (data) {
            return res.status(200).json(data)
        } else {
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
    })

}
export const deleteDocument = (req, res, next) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    mongoRequests.deleteTicket(req.body._id,decoded.username, (err, data) => {
        if (data) {
            return res.status(200).json(data)
        } else {
            console.log(err)
            return res.status(500).json({
                error: err
            })
        }
    })
}


