/**
 * Script um Daten aus einer Excel Tabelle in die Mongo DB zu laden und parallel bereits das Tagging zu ergänzen
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
dfd.readExcel('HighlightSetup.xlsx', ).then((df) => {
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
        date = date.replaceAll(" ", ".").replaceAll("-",".")
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

loadDataOfRow = (df, currentRow) => {
    if (currentRow < df.shape[0]) {
        if (df.at(currentRow, "Inclusion") == "YES") {


            let history = getHistory(df.at(currentRow, "USED_ticket_documentation"))

            let datesplitted = df.at(currentRow, "USED_openedDate").toString().split(".")
            let date = new Date(parseInt(datesplitted[0]), parseInt(datesplitted[1]) - 1, parseInt(datesplitted[2]), parseInt(datesplitted[3]), parseInt(datesplitted[4]), parseInt(datesplitted[5]))


            evaluation = false;

            preSolutionStandard = false

            preSolutionBase = false
            hasBeenReviewed = false
            markupTFormat = {}
            markupNFormat = []
            ticket = new model.tickets({
                markupNFormat: markupNFormat,
                markupTFormat: markupTFormat,
                hasBeenReviewed: hasBeenReviewed,
                includedForSolutions: preSolutionBase,
                internID: df.at(currentRow, "RELEVANT_number"),
                uhd_NR: df.at(currentRow, "RELEVANT_number"),
                date: date,
                report: df.at(currentRow, "RELEVANT_short_description"),
                main_category: df.at(currentRow, "USED_u_main_category_reporting"),
                category_1: df.at(currentRow, "USED_u_subcategory_1_reporting"),
                category_2: df.at(currentRow, "USED_u_subcategory_2_reporting"),
                category_3: df.at(currentRow, "USED_u_subcategory_3_reporting"),

                question: df.at(currentRow, "USED_work_notes").toString().replace(/  +/g, ' ').replaceAll("<", "").replaceAll(">", "").replaceAll("\r\r\n", "\n").replaceAll("\n\n", "\n").replaceAll("\r\n", "\n"),
                answerhistory: history,
                recommendedTickets: [],

                user_evaluation_shown: true,

                evaluation: evaluation,
                clusterCat: df.at(currentRow, "RELEVANT_ClusterCat"),
                preSolutionStandard: preSolutionStandard
            })
            ticket.save((err, complete) => {
                if (err) {
                    console.log(counter)
                    console.log(err)
                } else {

                    counter += 1
                    addedCounter += 1
                    console.log(counter.toString() + " : " + addedCounter.toString())
                    loadDataOfRow(df, currentRow + 1)
                }
            })

        } else {
            counter += 1
            console.log(counter.toString() + " : " + addedCounter.toString())
            loadDataOfRow(df, currentRow + 1)
        }


    } else {
        console.log("TheEnd")
        process.exit(0)
    }


}