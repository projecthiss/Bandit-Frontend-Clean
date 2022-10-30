const model = require('../mongoModel')



getMarkUpTFormat = (markupNFormat, question) => {
    let markupText = {}
    for (let i = markupNFormat.length- 1; i >= 0; i--) {
        let obj = markupNFormat[i]
        markupText[[obj.key]] = []
    }
    for (let i = markupNFormat.length - 1; i >= 0; i--) {
        let obj = markupNFormat[i]
        let t = question.slice(obj.start, obj.end)
        markupText[obj.key].push(t)
    }

    return markupText
}

model.tickets.find({hasBeenReviewed: true, deleted: false}, (err, data) => {

    console.log(data.length)
    updateData(data)

})
updateData = (my_data, position = 0) => {

    if (position < my_data.length) {
        t_format = getMarkUpTFormat(my_data[position].markupNFormat, my_data[position].question)

        model.tickets.findByIdAndUpdate(my_data[position]._id, {markupTFormat: t_format}, (err, data) => {

            if (err)
                console.log(err)
            console.log(position)
            updateData(my_data, position+1)
        })
    }
}
