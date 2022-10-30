import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import mongoRequests from "./mongoRequests"
import * as userRoutes from './routes/user'
import * as adminRoutes from './routes/admin'
import * as bandit from './routes/bandit'
import {checkAuth} from "./check-auth";
import * as ticketRoutes from "./routes/tickets";

const app = express()


// configure the middleware fpr requests
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json(
    {type: ['application/json', 'text/plain']}
))

const router = express.Router()

//link to static client files (generated in production Mode)
const staticFiles = express.static(path.join(__dirname, '../../client/build'))

app.use(staticFiles)

//bandit.setActions()


/**
 * Configure all possible APIs
 */
// delete a ticket, allows a logged in user to remove a document (in the db it just gets flagged as deleted for traceability)
app.delete('/api/tickets/deleteTicket', checkAuth(['user', 'admin']), ticketRoutes.deleteDocument)

// generates the statistic for the admin view
app.post('/api/admin/getStatistics', checkAuth(['user', 'admin']), adminRoutes.getStatistic)

// give the User a set of tickets (currently 10)
app.get('/getTickets', checkAuth(['user', 'admin']), ticketRoutes.getTickets)

//generateMarkUpFormatForTicket
app.post('/api/tickets/getMarkUpFormat', checkAuth(['user', 'admin']), ticketRoutes.getMarkUpFormat)


app.post('/api/ticket/saveTicket', checkAuth(['user', 'admin']), ticketRoutes.saveTicket)
app.post('/api/ticket/saveUserCreatedTicket', checkAuth(['user', 'admin']), ticketRoutes.saveUserCreatedTicket)

app.post('/api/bandit/learnAndSavePrediction', checkAuth(['user', 'admin']), ticketRoutes.learnAndSavePrediction)

// get a prediction for the context of a ticket
app.post('/api/bandit/getPrediction', checkAuth(['user', 'admin']), bandit.predictActions)


app.post('/api/user/login', userRoutes.login)

app.post('/api/admin/register', checkAuth('admin'), adminRoutes.register)

app.post('/api/user/getSettings', checkAuth(['user', 'admin']), userRoutes.getSettings)
app.post('/api/admin/setSettings', checkAuth('admin'), adminRoutes.setSettings)

/**
app.get('/getTicketByID', (req, res) => {
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
})
*/


app.use(router)

app.use('*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}`)
})