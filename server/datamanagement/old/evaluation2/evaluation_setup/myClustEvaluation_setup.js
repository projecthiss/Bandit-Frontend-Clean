const model = require('../../../../mongoModel')
const mongoose = require("../../../../mongoConnection").mongoose
const dfd = require("danfojs-node")

const all_data = require("./tickets.json")
const eval_data = require("./eval_data.json")


var added = 0
var evalualtion = 0
var uhd_eval_setup = []

upload_data = (data, iteration, max_iteration, currentRow) => {
    if (currentRow < data.length) {
        let found = true

        if (found) {
            let evaluation = false
            for (let eval_ticket of eval_data) {
                if (eval_ticket.uhd_NR == data[currentRow].uhd_NR) {
                    evaluation = true
                    break;
                }
            }


            if (evaluation){
                if (uhd_eval_setup.includes(data[currentRow].uhd_NR)){
                    ticket = new model.tickets({
                        hasBeenReviewed: false,
                        includedForSolutions: false,
                        deleted:false,
                        internID: data[currentRow].internID,
                        uhd_NR: data[currentRow].uhd_NR,
                        date: new Date(parseInt(data[currentRow].date.$date.$numberLong)),
                        report: data[currentRow].report,
                        category_1: data[currentRow].category_1,
                        category_2: data[currentRow].category_2,
                        question: data[currentRow].question,
                        answerhistory: data[currentRow].answerhistory,
                        recommendedTickets: [],
                        user_evaluation_shown: iteration

                    })


                    ticket.save((err, complete) => {
                        if (err) {
                            console.log(err)
                        } else {
                            evalualtion++
                            added++
                            upload_data(data,iteration, max_iteration, currentRow + 1)
                        }
                    })
                }
                else {
                    upload_data(data,iteration, max_iteration, currentRow + 1)
                }


            }
            else{
                if (iteration==0){
                    ticket = new model.tickets({
                        hasBeenReviewed: true,
                        includedForSolutions: true,
                        deleted:false,
                        internID: data[currentRow].internID,
                        uhd_NR: data[currentRow].uhd_NR,
                        date: new Date(parseInt(data[currentRow].date.$date.$numberLong)),
                        report: data[currentRow].report,
                        category_1: data[currentRow].category_1,
                        category_2: data[currentRow].category_2,
                        question: data[currentRow].question,
                        answerhistory: data[currentRow].answerhistory,
                        recommendedTickets: [],
                        markupNFormat: data[currentRow].markupNFormat,
                        markupTFormat: data[currentRow].markupTFormat,
                        user_evaluation_shown: iteration
                    })
                    ticket.save((err, complete) => {
                        if (err) {
                            console.log(err)
                        } else {
                            added++
                            upload_data(data,iteration, max_iteration, currentRow + 1)
                        }
                    })
                }
                else{
                    upload_data(data,iteration, max_iteration, currentRow + 1)
                }
            }

        } else {
            upload_data(data,iteration, max_iteration, currentRow + 1)
        }
    }
    else {
        console.log(max_iteration)
        console.log(iteration)
        if (iteration<max_iteration){
            upload_data(data,iteration+1, max_iteration, 0)
        }
        else{
            console.log(added)
            console.log(evalualtion)
            process.exit(0)
        }


    }
}



dfd.readExcel('eval_data.xlsx').then((df) => {
    for (let currentrow=0; currentrow< all_data.length; currentrow++){
        for (let hist of all_data[currentrow].answerhistory){
            hist.date = new Date(parseInt(hist.date.$date.$numberLong))
            delete hist._id
        }
        for (let nFormat of all_data[currentrow].markupNFormat){
            delete nFormat._id
        }
    }

    for (let i = 0; i < df.shape[0]; i++) {
        if (df.at(i, "Eval_incl") == "Eval") {
            uhd_eval_setup.push(df.at(i, "uhd_NR"))
        }
    }

    upload_data(all_data,0,30,  0)
})
