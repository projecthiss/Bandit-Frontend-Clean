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
addedCounter= 0
dfd.readExcel('StarkeReichert_UHD_GS_edited_Reduction.xlsx').then((df) => {
    console.log("loaded")
    //console.log(df.shape)
    //console.log(df.values[0])
    //console.log(df.shape[0])
    //console.log(df.at(13616 , "Antworthistorie"))

    loadDataOfRow(df, 0)
})


getHistory = (text) => {
    text = text
    history = []
    regex = /\d{2}([\/.-])\d{2}([\/.-])\d{4}/g
    indices = []
    while ((result = regex.exec(text))) {
        indices.push(result.index);
    }
    c = 0;
    for (let index of indices) {
        let date = ""
        let content = ""
        date = text.substr(index, 10)
        if (c + 1 == indices.length) {
            content = text.substr(index + 11)
        } else {
            content = text.substr(index + 11, indices[c + 1] - (index + 11))
        }
        c++;
        let regexTime = /\d{2}(:)\d{2}(:)\d{2}/g
        let dateformat = new Date();
        if (regexTime.test(content.substr(0, 8))) {
            dateformat = new Date(date.substr(6, 4), date.substr(3, 2), parseInt(date.substr(0, 2)) + 1, content.substr(0, 2), content.substr(3, 2), content.substr(6, 2))
            content = content.substr(10)
        } else {
            dateformat = new Date(date.substr(6, 4), date.substr(3, 2), parseInt(date.substr(0, 2)) + 1)
        }
        if (content.length == 0) {
            history.push({date: dateformat, content: " "})
        } else {
            history.push({date: dateformat, content: content})
        }
    }
    return history
}

loadDataOfRow = (df, currentRow) => {

    if (currentRow < df.shape[0] ) {
        if (df.at(currentRow, "Removal Reason or Included") == "Included") {


            let history = getHistory(df.at(currentRow, "Antworthistorie"))

            let datesplitted = df.at(currentRow, "Datum").toString().split(".")
            let date = new Date(datesplitted[2], datesplitted[1] - 1, parseInt(datesplitted[0]))


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
                internID: df.at(currentRow, "ID"),
                uhd_NR: df.at(currentRow, "UHD Nr"),
                date: date,
                report: df.at(currentRow, "Meldung"),
                main_category: "SW DMS Starke",
                category_1: df.at(currentRow, "Kategorie 2"),
                category_2: "SW DMS Starke",
                category_3: df.at(currentRow, "Kategorie 2"),

                question: df.at(currentRow, "Frage").toString().replace(/  +/g, ' ').replaceAll("<", "").replaceAll(">", "").replaceAll("\r\r\n", "\n").replaceAll("\n\n", "\n").replaceAll("\r\n", "\n"),
                answerhistory: history,
                recommendedTickets: [],

                evaluation: evaluation,
                clusterCat: "NULL",
                preSolutionStandard: preSolutionStandard
            })
            ticket.save((err, complete) => {
                if (err) {
                    console.log(counter)
                    console.log(err)
                } else {

                    counter += 1
                    addedCounter+= 1
                    console.log(counter.toString()+" : "+addedCounter.toString())
                    loadDataOfRow(df, currentRow + 1)
                }
            })

        }
        else{
            counter += 1
            console.log(counter.toString()+" : "+addedCounter.toString())
            loadDataOfRow(df, currentRow + 1)
        }

    } else {
        console.log("TheEnd")
        process.exit(0)
    }


}