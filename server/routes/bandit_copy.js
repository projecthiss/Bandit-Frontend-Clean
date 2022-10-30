const dbRequests = require('../mongoRequests')

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

const setActions = (next) => {
    allActions = []
    allActionsID = []
    dbRequests.getActions((err, data) => {
        if (data) {
            for (let action of data) {
                allActions.push(action.markupTFormat)
                allActionsID.push(action._id)
            }
        } else {
            console.log(err)
        }
    })
}

const predictActions = (req, res, next) => {
    console.log(allActions)
    console.log(allActionsID)
    request(getOptions('/predictActions', {
        allActionsID: allActionsID,
        allActions: allActions,
        context: req.body.markupTFormat}), (error, response) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                error: error
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
                for (let p of prediction) {
                    console.log(p.ticket._id)
                }
                return res.status(200).json({
                    prediction: prediction,
                    itemsIncluded: response.body.itemsIncluded
                })
            })
        }
    });
}

 const predictActionsForTraining= (markUpTFormat, next) => {

    request(getOptions('/predictActions', {
        allActionsID: allActionsID,
        allActions: allActions,
        context: markUpTFormat}), (error, response) => {
        if (error) {
            console.log(error)
            next(err)
        }
        if (response.statusCode != 200) {
            console.log("Error Getting Prediction")
            next("Error Getting Prediction")
        } else {

            let prediction = []
            let IDs = []
            response.body = JSON.parse(response.body)
            for (let predictedElement of response.body.prediction) {
                IDs.push(predictedElement.id)
            }
            dbRequests.getManyTicketByID(IDs, (err, data) => {
                if (err) {
                    console.log(err)
                    next(err)
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
                console.log(response.body.itemsIncluded)
                next(null, prediction, response.body.itemsIncluded)

            })
        }
    });
}

/**
 * NEEDED FORMAT
 * {
 *    "id": ID FIELD                                                          | Always
 *    "context": [{'field': 'value',...}],                                    | Always
 *    "itemsIncluded": INTEGER,                                               | Only learn
 *    "actions":[{"id": STRING, "probability": Float, "cost": FLOAT},...],    | Only Learn
 *    "addToActions": BOOLEAN                                                 | Only Learn
 *    "onlyAddAction": BOOLEAN                                                | Always
 * }
 */
const addActionToBandit = (id, markupTFormat) => {
    allActions.push(markupTFormat)
    allActionsID.push(id)
}
const learnAction = (req, res, next) => {
    let id = req.body.ticket._id
    let context = req.body.ticket.markupTFormat
    let itemsIncluded = req.body.trainingData.itemsIncluded
    let actions = req.body.trainingData.action
    let addToAction = req.body.trainingData.addToAction
    console.log("got to Learn")
    // [{"id": STRING, "probability": Float, "cost": FLOAT},...]
    if (addToAction == true) {
        addActionToBandit(id, context)
    }
    let data = {
        addToAction: addToAction,
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
        if (response.statusCode != 200) {
            //let jsonResponse = JSON.parse(response.body)

            console.log(response)
            console.log("error add Action")
            return res.status(response.statusCode).json({
                "error": "error at Bandit",
                "message": response
            })

        } else {
            console.log("success")
            return res.status(200).json({
                "message": "Success: Learning"
            })
            console.log(response.body);

        }
    });
}
const learnActionForTraining = (ticket, trainingData, next) => {
    let id = ticket._id
    let context = ticket.markupTFormat
    let itemsIncluded = trainingData.itemsIncluded
    let actions = trainingData.action
    let addToAction = trainingData.addToAction
    // [{"id": STRING, "probability": Float, "cost": FLOAT},...]
    if (addToAction == true) {
        addActionToBandit(id, context)
    }
    let data = {
        addToAction: addToAction,
        context: context,
        id: id,
        itemsIncluded: itemsIncluded,
        actions: actions,
        allActionsID: allActionsID,
        allActions: allActions
    }

    request(getOptions('/learnActions', data), (error, response) => {
        if (error) {
            return next(error)
        }
        if (response.statusCode != 200) {
            //let jsonResponse = JSON.parse(response.body)
            return next({
                "error": "error at Bandit",
                "message": response
            })
        } else {
            next(null, {
                "message": "Success: Learning"
            })
        }
    });
}

module.exports ={
    learnActionForTraining,
    predictActionsForTraining,
    setActions,
    learnAction,
    addActionToBandit
}