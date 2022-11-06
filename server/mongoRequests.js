const mongoose = require("./mongoConnection").mongoose
const model = require('./mongoModel')

/**
 * managet alle Anfragen an die MongoDatenbank, die funktionsnamen sind trivial
 */

const getUser = (name, done) => {
    model.users.findOne({name: name}, (err, data) => {
        if (err) {
            return done(null)
        } else if (data == undefined) return done(null)
        data.password_hash = null
        return done(null, data)
    })
}
// /**
//  *  Get a passwordhash from user by name
//  *  returns null or the userpassword
//  */
const getPasswordhash = (name, done) => {
    model.users.findOne({name: name}, (err, data) => {
        if (err) return done(err)
        return done(null, data.password_hash)
    })
}

const getTickets = (userIntID, username, done) => {
    model.users.countDocuments({}, (err, count) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        // für Evaluation
    //    model.tickets.find({
  //          hasBeenReviewed: false,
 //           user_evaluation_shown: userIntID,
 //           $or: [{userCreatedTicket: {$exists: false}}, {userCreatedTicket: false}]
//        })
            model.tickets.find({hasBeenReviewed: false})
            .populate({
                path: 'recommendedTickets.predictedItems.id',
                model: 'tickets'
            })
            .sort({date: 1})
            // für Evaluation
            .mod('userShownID', [count, userIntID])
            .limit(50)
            .exec((err, data) => {
                if (err) {
                    console.log(err)
                    return done(err)
                }
                console.log(username)
                console.log({hasBeenReviewed: false, userCreatedTicket: username})
                model.tickets.find({hasBeenReviewed: false, userCreatedTicket: username}).populate({
                    path: 'recommendedTickets.predictedItems.id',
                    model: 'tickets'
                }).exec((err, data_new )=> {
                    if (err) {
                        console.log(err)
                        return done(err)
                    }
                    console.log(data_new)
                    if (data_new=== null){
                        data_new=[]
                    }
                    for (let d of data){
                        data_new.push(d)
                    }
                    return done(null, data_new)
                })
            })
    })

}
const getEvaluationTicketIDs = (done) => {
    model.tickets.find({evaluation: true, includedForSolutions: false, hasBeenReviewed: false}).select({
        _id: 1,
        evaluation: 1,
        includedForSolutions: 1
    }).exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const getTicketByID = (id, done) => {


    model.tickets.findById(id).exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const getManyTicketByID = (ids, done) => {


    model.tickets.find({'_id': {$in: ids}}).exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const saveUserCreatedTicket = (ticket, done) => {
    const new_ticket = new model.tickets(ticket)
    new_ticket.save( (err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const saveTicket = (ticket, done) => {
    model.tickets.findByIdAndUpdate({_id: ticket._id}, ticket, (err, data) => {

        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const deleteTicket = (id, editor, done) => {

    model.tickets.updateOne({_id: id}, {hasBeenReviewed: true, editor: editor, deleted: true}, (err, data) => {
        console.log("removing Item")
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const createUser = (name, password_hash, userRole, done) => {
    const user = new model.users({name: name, accessRights: userRole, password_hash: password_hash})
    user.save((err, data) => {
        if (err) {
            return done(err)
        }
        return done(null, data)
    })
}
const setSettings = (colorScheme, logoEnabled, categories, predictionsEnabled, done, logoFile = null, logoFileName = null) => {
    let settings

    if (logoEnabled == true && logoFile != null) {
        settings = new model.settings({
            predictionsEnabled: predictionsEnabled,
            categories: categories,
            colorScheme: colorScheme,
            logoEnabled: logoEnabled,
            logoFileName: logoFileName,
            logoFile: logoFile
        })
    } else {
        settings = new model.settings({
            predictionsEnabled: predictionsEnabled,
            categories: categories,
            colorScheme: colorScheme,
            logoEnabled: logoEnabled
        })
    }
    settings.save((err, data) => {
        if (err) {
            return done(err)
        }
        return done(null, data)
    })
}
const getSettings = (done) => {
    model.settings.findOne().exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const getActions = (done) => {
    model.tickets.find({includedForSolutions: true}).sort({reviewedDate: 1, userShownID: 1, category_2: 1}).select({
        _id: 1,
        markupTFormat: 1
    }).exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}

const getStatisticData = (done) => {
    model.tickets.find({$nor: [{"recommendedTickets": {$size: 0}}]}).sort({
        reviewedDate: 1,
        userShownID: 1
    }).select({recommendedTickets: 1}).exec((err, data) => {
        if (err) {
            console.log(err)
            return done(err)
        }
        return done(null, data)
    })
}
const savePrediction = (_id, recommendedItems, done) => {
    console.log(recommendedItems)
    model.tickets.findByIdAndUpdate(_id, {recommendedTickets: recommendedItems}, (err, data) => {
        done(err, data)
    })
}

module.exports = {
    getActions,
    savePrediction,
    getStatisticData,
    getSettings,
    setSettings,
    getTickets,
    saveTicket,
    deleteTicket,
    getTicketByID,
    getUser,
    createUser,
    getPasswordhash,
    getEvaluationTicketIDs,
    getManyTicketByID,
    saveUserCreatedTicket
}