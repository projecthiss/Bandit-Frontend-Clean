const mongoRequests = require('../mongoRequests')
//import {getUserIntID} from "./user";

const bandit = require('./bandit_copy')

const saveTicketForTraining = (_id, markupNFormat,markupTFormat,includedForSolutions,  ticket, trainingdata, next) => {
    let action = undefined
    if (trainingdata != undefined) {
        action = trainingdata.action
    }
    costString=""
    for (a of action){
        costString=costString+" "+a.cost
    }
    console.log(costString)
    mongoRequests.saveTicket(_id, markupNFormat, markupTFormat, includedForSolutions, action, (err, data) => {

        if (data) {
            //learn Action
            //add Action?
            ticket.markupTFormat= ticket.preMarkupTFormat
            if (trainingData != undefined) {
                //    WRITE
                return bandit.learnActionForTraining(ticket, trainingdata, next)
            }
            if (includedForSolutions) {
                console.log("addActionToBandit")
                bandit.addActionToBandit(_id, markupTFormat)
            }

            return next(null, data)

        } else {
            console.log(err)
            return next(err)

        }
    })
}

module.exports = {
    saveTicketForTraining
}