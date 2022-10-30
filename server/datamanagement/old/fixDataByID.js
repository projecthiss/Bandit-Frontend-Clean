

const model = require('./mongoModel')

counter = 0
colormode=false
model.tickets.find({hasBeenReviewed:true, deleted:false}, (err, data)=>{
    x=0
    for (d of data){

        if (colormode==true) {
            if (d.markupNFormat.some(e => e.color !== '#auslöser')){
                myArray = d.markupNFormat
                for (var i = myArray.length - 1; i >= 0; --i) {
                    if (myArray[i].color == "#auslöser") {
                        myArray.splice(i,1);
                    }
                }

                markupText = {}

                for (var i = myArray.length - 1; i >= 0; i--) {
                    obj =myArray[i]
                    markupText[[obj.key]] = []
                }

                for (var i = myArray.length - 1; i >= 0; i--) {
                    obj = myArray[i]
                    t = d.question.slice(obj.start, obj.end)
                    markupText[obj.key].push(t)
                }
                let t_format = markupText
                //console.log(t_format)
                model.tickets.findByIdAndUpdate(d._id, {markupNFormat: myArray, markupTFormat: t_format}, (err, data)=>{
                    if(err)
                        console.log(err)
                })
                //console.log(myArray)
            }
        }
        else{
            myArray = d.markupNFormat
            markupText = {}

            for (var i = myArray.length - 1; i >= 0; i--) {
                obj =myArray[i]
                markupText[[obj.key]] = []
            }

            for (var i = myArray.length - 1; i >= 0; i--) {
                obj = myArray[i]
                t = d.question.slice(obj.start, obj.end)
                markupText[obj.key].push(t)
            }
            t_format = markupText
            model.tickets.findByIdAndUpdate(d._id, {markupTFormat: t_format}, (err, data)=>{
                if(err)
                    console.log(err)
            })
            console.log(x)
            x++
        }


    }
})

/**
updateRow = (data, currentIndex) => {
    if (data.length > currentIndex) {
        let nlength= data[currentIndex].markupNFormat.length
        let i=0
        while (i<nlength){
            delete data[currentIndex].markupNFormat[i]._id
            i++
        }

        model.tickets.findOneAndUpdate({uhd_nr: data[currentIndex].uhd_nr, internID: data[currentIndex].internID},
            {
                includedForSolutions: data[currentIndex].includedForSolutions,
                hasBeenReviewed: data[currentIndex].hasBeenReviewed,
                recommendedTickets: data[currentIndex].recommendedTickets,
                deleted: data[currentIndex].deleted,
                markupNFormat: data[currentIndex].markupNFormat,
                markupTFormat: data[currentIndex].markupTFormat,
                question: data[currentIndex].question,
                evaluation: data[currentIndex].evaluation,
                reviewedDate: Date(data[currentIndex].reviewedDate)
            }, (err, complete) => {
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
        process.exit(0)
    }
}

updateRow(myData, 0)
**/