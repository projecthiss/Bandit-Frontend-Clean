/**
 * Script to load data from an Excel table into the Mongo DB and to add the tagging in parallel.
 */

const model = require('../mongoModel')


const dfd = require("danfojs-node")

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

counter = 0
addedCounter = 0
dfd.readExcel('output_ticket_labeling.xlsx',).then((df) => {
    //console.log("loaded")
    //console.log(df.shape)
    //console.log(df.values[0])
    //console.log(df.shape[0])
    //console.log(df.at(13616 , "Antworthistorie"))
    df.head().print()
    loadDataOfRow(df, 0)
})


getHistory = (text) => {

    text = text
    history = []
    regex = /\d{4}([\/.-])\d{2}([\/.-])\d{2}( )\d{2}(:)\d{2}(:)\d{2}( - )/g
    indices = []
    while ((result = regex.exec(text))) {
        indices.push(result.index);
    }
    c = 0;
    for (let index of indices) {
        let date = ""
        let content = ""
        date = text.substr(index, 19)
        if (c + 1 == indices.length) {
            content = text.substr(index + 22)
        } else {
            content = text.substr(index + 22, indices[c + 1] - (index + 22))
        }
        c++;
        date = date.replaceAll(" ", ".").replaceAll("-", ".")
        const datesplitted = date.replaceAll(":", ".").split(".")

        const dateformat = new Date(parseInt(datesplitted[0]), parseInt(datesplitted[1]) - 1, parseInt(datesplitted[2]), parseInt(datesplitted[3]), parseInt(datesplitted[4]), parseInt(datesplitted[5]))

        if (content.length == 0) {
            history.push({date: dateformat, content: " "})
        } else {
            history.push({date: dateformat, content: content})
        }
    }

    return history
}
dateCount = 0
loadDataOfRow = (df, currentRow) => {
    if (currentRow < df.shape[0]) {


        let history = getHistory(df.at(currentRow, "solution_sorted"))


        let date = new Date(new Date()).setDate(new Date().getDate() + dateCount)
        dateCount++

        evaluation = false;

        preSolutionStandard = false

        preSolutionBase = false
        hasBeenReviewed = false
        markupTFormat = {}
        markupNFormat = []
        ticketData = {
            markupNFormat: markupNFormat,
            markupTFormat: markupTFormat,
            hasBeenReviewed: hasBeenReviewed,
            includedForSolutions: preSolutionBase,
            internID: df.at(currentRow, "internID"),
            uhd_NR: df.at(currentRow, "number"),
            date: date,
            report: df.at(currentRow, "short_description"),
            main_category: df.at(currentRow, "u_main_category_reporting"),
            category_1: df.at(currentRow, "u_subcategory_1_reporting"),
            category_2: df.at(currentRow, "u_subcategory_2_reporting"),
            category_3: " ",

            question: df.at(currentRow, "problem").toString().replace(/  +/g, ' ').replaceAll("<", "").replaceAll(">", "").replaceAll("\r\r\n", "\n").replaceAll("\r\n", "\n").replaceAll("\n\n", "\n").replaceAll("\n\n", "\n"),
            answerhistory: history,
            recommendedTickets: [],

            user_evaluation_shown: true,

            evaluation: evaluation,
            clusterCat: df.at(currentRow, "merged_clusters"),
            preSolutionStandard: preSolutionStandard
        }
        ticket = new model.tickets(ticketData)
        ticket2 = new model.tickets(ticketData)
        console.log(history)
        ticket.save((err, complete) => {
                if (err) {
                    console.log(counter)
                    console.log(err)
                } else {
                    if (err) {
                        console.log(counter)
                        console.log(err)
                    } else {
                        ticket2.save((err, complete) => {
                            if (err) {
                                console.log(counter)
                                console.log(err)
                            } else {
                                if (err) {
                                    console.log(counter)
                                    console.log(err)
                                } else {
                                    counter += 1
                                    addedCounter += 1
                                    console.log(counter.toString() + " : " + addedCounter.toString())
                                    loadDataOfRow(df, currentRow + 1)
                                }
                            }
                        })
                    }

                }
            }
        )


    } else {
        console.log("TheEnd")
        process.exit(0)
    }


}
