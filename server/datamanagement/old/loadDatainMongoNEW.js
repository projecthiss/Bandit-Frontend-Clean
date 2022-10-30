/**
 * Script um Daten aus einer Excel Tabelle in die Mongo DB zu laden und parallel bereits das Tagging zu ergänzen
 */

const mongoose = require("./mongoConnection").mongoose
const model = require('./mongoModel')
var request = require('request')

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
dfd.readExcel('starke_data_edited.xlsx').then((df) => {
    console.log("loaded")
    //console.log(df.values[0])

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
    if (currentRow != df.values.length) {
        row = df.values[currentRow]
        let history = getHistory(row[6])

        let datesplitted = row[2].split("-")
        let date = new Date(datesplitted[2], datesplitted[1] - 1, parseInt(datesplitted[0]) + 1)

        request(getOptions('/automaticHighlighting', {frage: row[5].replaceAll("   ", "\n")}), (error, response) => {
            if (error) {
                console.log(error)

            }
            if (response.statusCode != 200) {
                //let jsonResponse = JSON.parse(response.body)

                console.log(response)
                console.log("error add Action")


            } else {

                result= JSON.parse(response.body)

                evaluation= false;
                if (row[16]=="Evaluation"){
                    evaluation=true
                }
                preSolutionStandard=false
                if(row[11]=="Yes?"){
                    preSolutionStandard=true
                }
                preSolutionBase=false
                hasBeenReviewed=false
                markupTFormat=[]
                markupNFormat=[]
                if(row[17]==true){
                    preSolutionBase=true
                    hasBeenReviewed=true
                    markupNFormat= result.nFormat
                    markupTFormat= result.tFormat
                }
                ticket = new model.tickets({
                    markupNFormat: markupNFormat,
                    markupTFormat: markupTFormat,
                    hasBeenReviewed: hasBeenReviewed,
                    includedForSolutions: preSolutionBase,
                    internID: row[0],
                    uhd_NR: row[1],
                    date: date,
                    report: row[3],
                    category_1: "SW DMS Starke",
                    category_2: row[4],
                    question: row[5].replaceAll("   ", "\n"),
                    answerhistory: history,
                    recommendedTickets: [],

                    evaluation: evaluation,
                    clusterCat: row[9],
                    preSolutionStandard: preSolutionStandard,
                    preMarkupNFormat: result.nFormat,
                    preMarkupTFormat: result.tFormat
                })
                ticket.save()
                counter += 1
                console.log(counter)
                loadDataOfRow(df, currentRow + 1)
            }
        });

    }
    else{
        console.log("TheEnd")
    }
}