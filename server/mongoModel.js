const mongoose = require("./mongoConnection").mongoose
const autoIncrement = require('mongoose-auto-increment');
/**
 * Schmas für die MongoDB
 */

autoIncrement.initialize(mongoose)

mongoose.set('useCreateIndex', true)

const Schema = mongoose.Schema;
const settingsSchema = new Schema({
        categories: [
            {
                categoryName: {type: String},
                color: {type: String},
                key: {type: String}
            }
        ],
        colorScheme: {type: String},
        logoEnabled: {type: Boolean, required: true, default: false},
        logoFileName: {type: String},
        logoFile: {type: String},
        predictionsEnabled: {type: Boolean, default: false}
    }, {capped: {size: 8192, max: 1, autoIndexId: true}}
)

const settings = mongoose.model("settings", settingsSchema)

const userSchema = new Schema({
    name: {type: String, required: true, unique: true},
    accessRights: {type: String, required: true},
    password_hash: {type: String, required: true},
    userIntID: {type: Number}
})
userSchema.plugin(autoIncrement.plugin, {model: 'users', field: 'userIntID', startAt: 2,})
const users = mongoose.model("users", userSchema)


const ticketsSchema = new Schema({
    markupNFormat: [
        {
            color: {type: String},
            start: {type: Number},
            end: {type: Number},
            key: {type: String},

        }],
    userCreatedTicket: {type: String},
    markupTFormat: {},
    userShownID: {type: Number},
    includedForSolutions: {type: Boolean, default: false},
    hasBeenReviewed: {type: Boolean, default: false},
    reviewedDate: {type: Date},
    internID: {type: String, required: true},
    uhd_NR: {type: String, required: true},
    date: {type: Date, required: true},
    report: {type: String, required: true},
    main_category: {type: String, required: true},
    category_1: {type: String, required: true},
    category_2: {type: String, required: true},
    category_3: {type: String, required: true},
    question: {type: String, required: true},
    editor: {type: String},
    answerhistory: [
        {
            date: {type: Date, required: true},
            content: {type: String, required: true},
        }
    ],
    recommendedTickets: [{
        usedNFormat: [{
            color: {type: String},
            start: {type: Number},
            end: {type: Number},
            key: {type: String}
        }],
        usedTFormat: {},
        itemsIncluded: {type: String},
        finalPrediction: {type: Boolean, required: true},
        predictedItems: [{
            id: {type: Schema.Types.ObjectId, ref: 'tickets', required:true},
            probability: {type: Number},
            cost: {type: Number}

        }]
    }],
    user_evaluation_shown: {type: Number, required: true},
    clusterCat: {type: String, required: true},
    deleted: {type: Boolean, default: false},
}, {collection: 'tickets'})

ticketsSchema.plugin(autoIncrement.plugin, {model: 'tickets', field: 'userShownID'})


const tickets = mongoose.model("tickets", ticketsSchema)
/*
module.exports = {
    tickets: tickets,
    users: users,
    settings: settings
}
 */
module.exports = {
    tickets,
    users,
    settings
}