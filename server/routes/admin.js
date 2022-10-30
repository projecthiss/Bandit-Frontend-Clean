import bcrypt from 'bcrypt'
import dbRequests from '../mongoRequests'

export const register = (req, res, next) => {
    dbRequests.getUser(req.body.username, (err, data) => {
        if (data) {
            return res.status(409).json({
                message: 'user already exists!',
            })
        }
        bcrypt.hash(req.body.password, 13, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                })
            }
            dbRequests.createUser(req.body.username, hash, req.body.userRole, (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: err,
                    })
                }
                return res.status(200).json({
                    message: 'User succesfully created',
                })
            })
        })
    })
}
export const setSettings = (req, res, next) => {
    if (req.body.logoEnabled) {
        dbRequests.setSettings(req.body.colorScheme, req.body.logoEnabled, req.body.categories, req.body.predictionsEnabled, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    error: err,
                })
            }
            console.log("done")
            return res.status(200).json({
                message: 'User succesfully created',
            })
        }, req.body.logoFile, req.body.logoFileName)
    } else {
        dbRequests.setSettings(req.body.colorScheme, req.body.logoEnabled, req.body.categories, req.body.predictionsEnabled, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    error: err,
                })
            }
            console.log("done")
            return res.status(200).json({
                message: 'User succesfully created',
            })
        })
    }

}


export const getStatistic = (req, res, next) => {
    dbRequests.getStatisticData((err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                error: err,
            })
        }

        let d = [{name: 0, roundAvarageCumulated: 0, bestValueCumulated:0, bestValue:0, averageValue:0}]
        let averageCumulated = 0
        let bestValueCumulated = 0
        let cycles = 1
        for (let recommendationCycle of data) {
            let bestValue = 0
            let averageValue = 0
            for (let rec of recommendationCycle.recommendedTickets) {
                averageValue += -1 * rec.cost
                if (bestValue < -1 * rec.cost)
                    bestValue = -1 * rec.cost
            }
            averageValue = averageValue / recommendationCycle.recommendedTickets.length
            averageCumulated = averageCumulated + averageValue
            bestValueCumulated = bestValueCumulated + bestValue

            //cumulated= (cumulated+value)/cycles
            d.push({
                name: cycles,
                roundAvarageCumulated: averageCumulated / cycles,
                bestValueCumulated: bestValueCumulated / cycles,
                bestValue: bestValue,
                averageValue: averageValue
            })
            cycles += 1
        }

        return res.status(200).json({
            ctrData: d,
            message: 'Got Statitisc Data',
        })
    })
}