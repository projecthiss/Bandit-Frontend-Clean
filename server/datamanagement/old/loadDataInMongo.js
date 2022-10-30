const mongoose = require("./mongoConnection").mongoose
const model = require('./mongoModel')

const fs = require("fs");

/**
 * Script um Daten aus einer CSV Datei in die Mongo DB zu laden. Das Tagging wird noch nicht ergänzt
 */


print = (text) =>{
    console.log(text)
}
noq=0

ticketcount=0
fs.readFile("starkeData.csv", function(error, data) {
    if (error) { throw error; }
    firstline=true
    count=0
    ticketCollection = []
    data.toString().split("\n").forEach(function(line, index, arr) {
        if(count%100==0){
            print(count)
        }
        count++
        if (index === arr.length - 1 && line === "") { return; }
        if(firstline==true){
            firstline=false
        }
        else{
            line = line.split(";")
            text = line[8]
            history = []
            regex = /\d{2}([\/.-])\d{2}([\/.-])\d{4}/g
            indices = []
            while ( (result = regex.exec(text)) ) {
                indices.push(result.index);
            }
            c=0;
            for (let index of indices){
                date=""
                content=""
                index=index
                date= text.substr(index, 10)
                if (c+1==indices.length){
                    content=text.substr(index+11)
                }else {
                    content=text.substr(index+11, indices[c+1]-(index+11))
                }
                c++;
                regexTime =  /\d{2}(:)\d{2}(:)\d{2}/g
                dateformat = new Date();
                if (regexTime.test(content.substr(0,8))){
                    dateformat = new Date(date.substr(6,4), date.substr(3,2),parseInt(date.substr(0,2))+1, content.substr(0,2), content.substr(3,2), content.substr(6,2))
                    content=content.substr(10)
                }
                else{
                   dateformat = new Date(date.substr(6,4), date.substr(3,2),parseInt(date.substr(0,2))+1)
                }
                if(content.length==0){
                    history.push({date: dateformat, content: " "})
                }
                else{
                    history.push({date: dateformat, content: content})
                }
            }
            datesplitted=line[3].split(".")
            date= new Date(datesplitted[2],datesplitted[1]-1,parseInt(datesplitted[0])+1)
            if(line[7].length>0){

                ticket = new model.tickets({
                    markupNFormat:[],
                    markupTFormat: {
                    },
                    hasBeenReviewed:false,
                    includedForSolutions: false,
                    internID: line[1],
                    uhd_NR: line[2],
                    date: date,
                    report: line[4],
                    category_1: line[5],
                    category_2: line[6],
                    question: line[7],
                    answerhistory: history,
                    recommendedTickets:[]
                })
                ticketCollection.push(ticket)

                //ticket.save(function (err) {
                //    if (err) print(err);
                //    ticketcount++
                //    print("saved! Ticketcount: "+ ticketcount)

            //    })
            }
            else{

                print("noQuestion")
                noq++;
                print(noq)
            }




        }
        //console.log(index + " " + line);
    });
    for (ticket of ticketCollection){
        t=0
        e=0
        ticket.save((err, data)=>{
            if (err){
                console.log(err)
                console.log("e "+e)
                e++
            }
            else{
                console.log("t "+t)
                t++
            }
        })
    }
    /**model.tickets.insertMany(ticketCollection, function (err,data){
        console.log("done")
        console.log(err)
        console.log(data)

    })
     **/
    console.log("end");
});
console.log("end2")
