const model = require('../mongoModel')
const dfd = require("danfojs-node")
const mongoose = require("../mongoConnection").mongoose


const all_data = require("./clustered_new.json")
const eval_data = require("./eval_data.json")


var added = 0
var evalualtion = 0

upload_data = (data, iteration, max_iteration, cluster_df, currentRow) => {
    if (currentRow < data.length) {
        let found = false

        // check ob Ticket ein CLuster von mir besitzt
        for (let i = 0; i < cluster_df.shape[0]; i++) {
            if (data[currentRow].uhd_NR == cluster_df.at(i, "uhd_NR") && cluster_df.at(i, "versuch") != "null") {
                found = true
                break
            }
        }
        if (found) {
            let evaluation = false
            for (let eval_ticket of eval_data) {
                if (eval_ticket.internID == data[currentRow].internID) {
                    evaluation = true
                    break;
                }
            }


            if (evaluation){
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
                    answerhistory: data.answerhistory,
                    recommendedTickets: [],
                    user_evaluation_shown: iteration

                })
                ticket.save((err, complete) => {
                    if (err) {
                        console.log(err)
                    } else {
                        evalualtion++
                        added++
                        upload_data(data,iteration, max_iteration, cluster_df, currentRow + 1)
                    }
                })

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
                            upload_data(data,iteration, max_iteration, cluster_df, currentRow + 1)
                        }
                    })
                }
                else{
                    upload_data(data,iteration, max_iteration, cluster_df, currentRow + 1)
                }
            }

        } else {
            upload_data(data,iteration, max_iteration, cluster_df, currentRow + 1)
        }
    }
    else {
        console.log(max_iteration)
        console.log(iteration)
        if (iteration<max_iteration){
            upload_data(data,iteration+1, max_iteration, cluster_df, 0)
        }
        else{
            console.log(added)
            console.log(evalualtion)
            process.exit(0)
        }


    }
}

dfd.readExcel('my_clust.xlsx').then((df) => {
    console.log("loaded")
    //console.log(df.shape)
    //console.log(df.values[0])
    //console.log(df.shape[0])
    //console.log(df.at(13616 , "Antworthistorie"))
    for (let currentrow=0; currentrow< all_data.length; currentrow++){
        for (let hist of all_data[currentrow].answerhistory){
            hist.date = new Date(parseInt(hist.date.$date.$numberLong))
            delete hist._id
        }
        for (let nFormat of all_data[currentrow].markupNFormat){
            delete nFormat._id
        }
    }

   upload_data(all_data,0,1,  df,  0)

})