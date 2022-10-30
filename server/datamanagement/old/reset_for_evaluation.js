const model = require('../mongoModel')
var myData = require("./2022_06_16_14_41_all_data.json")

/**model.tickets.find({editor: "mahei"}, (err, data) => {
    i=0
    for (let foundTicket of data) {
        locquestion=""
        for (let ticket of myData) {
            if (ticket.internID == foundTicket.internID) {
                locquestion=ticket.question
            }
        }
        model.tickets.findByIdAndUpdate(foundTicket.id, {hasBeenReviewed:false, deleted: false, editor: "", markupNFormat: [], markupTFormat:{}  }, (err, data)=>{
            console.log(i)
            i++
        })
    }

    //console.log(data[0])
    //console.log(data.length)
})**/

model.tickets.updateMany({hasBeenReviewed: true, deleted:false}, {includedForSolutions: true} , (err, data) => {
})
