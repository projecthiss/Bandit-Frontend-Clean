import * as  dbRequests from '../mongoRequests'
import {set} from "mongoose";
import {learnAndSavePrediction} from "./tickets";

var request = require('request')

const banditURL = process.env.BANDIT_URL


let allActions = []
let allActionsID = []

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

export const setActions = (next) => {
    allActions = []
    allActionsID = []
    dbRequests.getActions((err, data) => {
        if (data) {
            for (let action of data) {
                allActions.push(action.markupTFormat)
                allActionsID.push(action._id)
            }
            next()
        } else {
            console.log(err)
        }
    })
}

export const predictActions = (req, res, next) => {
    console.log(req.body.markupTFormat)
    setActions(() => {
        request(getOptions('/predictActions', {
            allActionsID: allActionsID,
            allActions: allActions,
            context: req.body.markupTFormat
        }), (error, response) => {
            if (error) {
                console.log(error)
                return res.status(500).json({
                    error: error
                })
            }
            if (response===undefined){
                return res.status(500).json({
                    errorMessage: "No Connection to Bandit"
                })
            }
            if (response.statusCode != 200) {
                console.log("Error Getting Prediction")
                console.log(response.body);
                return res.status(500).json({
                    error: error
                })
            } else {
                let prediction = []
                let IDs = []
                response.body = JSON.parse(response.body)
                console.log(response.body.prediction)
                for (let predictedElement of response.body.prediction) {
                    IDs.push(predictedElement.id)
                }
                dbRequests.getManyTicketByID(IDs, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: err
                        })
                    }
                    for (let predictedElement of response.body.prediction) {
                        let foundTicket = {}
                        for (let d of data) {
                            if (d._id == predictedElement.id)
                                foundTicket = d
                        }
                        prediction.push({
                            ticket: foundTicket,
                            probability: predictedElement.probability
                        })
                    }
                    return res.status(200).json({
                        prediction: prediction,
                        itemsIncluded: response.body.itemsIncluded
                    })
                })
            }
        });
    })

}


/**
 * NEEDED FORMAT
 * {
 *    "id": ID FIELD                                                          | Always
 *    "context": [{'field': 'value',...}],                                    | Always
 *    "itemsIncluded": INTEGER,                                               | Only learn
 *    "actions":[{"id": STRING, "probability": Float, "cost": FLOAT},...],    | Only Learn
 *    "onlyAddAction": BOOLEAN                                                | Always
 * }
 */
export const addActionToBandit = (id, markupTFormat) => {
    allActions.push(markupTFormat)
    allActionsID.push(id)
}
export const learnPrediction = (req,res,next) => {
    learnAction(req,res,next)
}

export const learnAction = (req, res, next) => {

    setActions(() => {
        let id = req.body.ticket._id
        let context = req.body.ticket.markupTFormat
        let itemsIncluded = req.body.ticket.recommendedTickets.slice(-1)[0].itemsIncluded
        let actions = req.body.ticket.recommendedTickets.slice(-1)[0].predictedItems
        console.log("got to Learn")
        // [{"id": STRING, "probability": Float, "cost": FLOAT},...]

        let data = {
            context: context,
            id: id,
            itemsIncluded: itemsIncluded,
            actions: actions,
            allActionsID: allActionsID,
            allActions: allActions
        }
        request(getOptions('/learnActions', data), (error, response) => {
            if (error) {
                console.log(error)
                return res.status(500).json({
                    "error": "error at Bandit",
                    "message": error
                })
            }
            if (response===undefined){
                return res.status(500).json({
                    errorMessage: "No Connection to Bandit"
                })
            }
            if (response.statusCode != 200) {
                return res.status(response.statusCode).json({
                    "error": "error at Bandit",
                    "message": response
                })
            } else {
                console.log("success")

                return res.status(200).json({
                    "message": "Success: Learning"
                })
            }
        });
    })

}