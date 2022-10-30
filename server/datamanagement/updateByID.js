var myData = require("./labeled_data_before_category_setting.json")
const model = require('../mongoModel')

counter = 0

updateRow = (data, currentIndex) => {
    if (data.length > currentIndex) {
        let nlength= data[currentIndex].markupNFormat.length
        let i=0
        while (i<nlength){
            delete data[currentIndex].markupNFormat[i]._id
            i++
        }
        update_data={}
        if (!data[currentIndex].deleted){
            update_data= {
                editor: data[currentIndex].editor,
                includedForSolutions: data[currentIndex].includedForSolutions,
                hasBeenReviewed: data[currentIndex].hasBeenReviewed,
                recommendedTickets: data[currentIndex].recommendedTickets,
                deleted: data[currentIndex].deleted,
                markupNFormat: data[currentIndex].markupNFormat,
                markupTFormat: data[currentIndex].markupTFormat,
                question: data[currentIndex].question,
                evaluation: data[currentIndex].evaluation,
                reviewedDate: Date(data[currentIndex].reviewedDate),
//                includedForSolutions: true
            }
        }
        else{
            update_data= {
                includedForSolutions: data[currentIndex].includedForSolutions,
                editor: data[currentIndex].editor,
                hasBeenReviewed: data[currentIndex].hasBeenReviewed,
                recommendedTickets: data[currentIndex].recommendedTickets,
                deleted: data[currentIndex].deleted,
                markupNFormat: data[currentIndex].markupNFormat,
                markupTFormat: data[currentIndex].markupTFormat,
                question: data[currentIndex].question,
                evaluation: data[currentIndex].evaluation,
                reviewedDate: Date(data[currentIndex].reviewedDate),
 //               includedForSolutions: false
            }
        }

        model.tickets.findOneAndUpdate({uhd_nr: data[currentIndex].uhd_nr, internID: data[currentIndex].internID},
            update_data, (err, complete) => {
                if (err) {
                    console.log(counter)
                    console.log(err)
                    process.exit(0)
                } else {

                    counter += 1
                    console.log(counter)
                    updateRow(data, currentIndex + 1)
                }
            })
    } else {
        console.log("TheEnd")
        console.log(myData.length)
        process.exit(0)
    }
}

//model.tickets.updateMany({hasBeenReviewed: true}, {editor:"admin"}, ()=>{
//    console.log("done")
//})

updateRow(myData, 0)