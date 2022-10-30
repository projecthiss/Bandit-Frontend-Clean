//const uri = process.env.API_URL.length != 1 ? 'https://' + process.env.API_URL : '/'

//const uri = process.env.API_URL.length != 1 ? process.env.API_URL : '/'
const uri = "/"

const header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

// handle JWT Update

const authHeader = () => {
    const h = new Headers()
    h.append('Accept', 'application/json')
    h.append('Content-Type', 'application/json')
    h.append('Authorization', window.sessionStorage.getItem('jwt'))
    return h
}

// login
export const login = (username, password, onSuccess, onError) => {
    fetch(uri + 'api/user/login', {
        method: 'POST',
        headers: header,
        body: JSON.stringify(
            {
                username: username,
                password: password,
            }
        ),
        //})//.then((response) => {
        // switch (response.status) {
        //    case 200: return response.json()
        //    case 505: ;
        //       break;
        //  case 401: ;
        //}
        //onError(new Error('login failed'))
    }).then((response) => {

        if (response.status === 200)
            return response.json()
        onError(new Error('login failed'))
    }).then((data) => {
        window.sessionStorage.setItem('userRole', data.userRole)
        window.sessionStorage.setItem('jwt', data.jwt)

        onSuccess(data)
    }).catch((err) => onError(err))
}
export const logout = (onSuccess, onError) => {
    const key = 'jwt'
    try {
        window.sessionStorage.removeItem(key)
        window.sessionStorage.removeItem('userRole')
        window.location = "/"
        onSuccess()
    } catch (error) {
        onError(new Error('not logged in'))
    }

}
export const saveNewTicket = (ticket, onSuccess, onError)=>{
    fetch(uri + 'api/ticket/saveUserCreatedTicket', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ticket: ticket}),
    }).then((response) => {
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout()
            default:
                console.log("none of the expected errors")
        }

        onError(new Error('Get Settings Failed'))
    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}
// getTickets (requiresLogin)

// getTicket (requiresLogin)
export const getTickets = (onSuccess, onError) => {
    fetch('getTickets', {
        method: 'GET',
        headers: authHeader(),
    }).then(res => res.json())
        .then(
            (result) => {
                onSuccess(result)
            },
            (error) => {
                onError(error)
                console.log(error)
            }
        )
}
// getUserProfile (requiresLogin)


// getSettingsStyle
export const getSettings = (onSuccess, onError) => {
    fetch(uri + 'api/user/getSettings', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({}),
    }).then((response) => {
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout()
            default:
                console.log("none of the expected stati")
        }

        onError(new Error('Get Settings Failed'))
    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}


// setSettings (requiresLogin)
export const setSettings = (categories, colorScheme, predictionsEnabled, logoEnabled, logoFileName, logoFile, onSuccess, onError) => {
    let body
    if (logoEnabled === true) {
        body = {
            categories: categories,
            colorScheme: colorScheme,
            logoEnabled: logoEnabled,
            logoFileName: logoFileName,
            logoFile: logoFile,
            predictionsEnabled: predictionsEnabled
        }
    } else {
        body = {
            categories: categories,
            colorScheme: colorScheme,
            logoEnabled: logoEnabled,
            predictionsEnabled: predictionsEnabled
        }
    }
    fetch(uri + 'api/admin/setSettings', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error('setttings Failed')
        }
    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}

// getRecommendation (requiresLogin)

// saveFeedback (requiresLogin)

// deleteCurrentTicket (requiresLogin)

// register (AdminProtected)
export const register = (username, password, userRole, onSuccess, onError) => {
    fetch(uri + 'api/admin/register', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(
            {
                username: username,
                password: password,
                userRole: userRole
            }
        ),
    }).then((response) => {

        if (response.status !== 200) {
            throw new Error('registration failed')
        }
    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}
export const getPrediction = (context, onSuccess, onError) => {
    fetch(uri + 'api/bandit/getPrediction', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(
            {
                markupTFormat: context
            }
        ),
    }).then((response) => {
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session expired")
            default:
                throw new Error('get Prediction Failed')
        }



        console.log(response)
    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}
export const getStatistics = (onSuccess, onError) => {
    fetch(uri + 'api/admin/getStatistics', {
        method: 'POST',
        headers: authHeader()
    }).then((response) => {
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session expired")
            default:
                throw new Error('get Statistic Failed')
        }



    }).then((data) => {
        onSuccess(data)
    }).catch((err) => onError(err))
}
// saveTicket (requiresLogin)
export const learnTicket = (ticket, context, trainingData, onSuccess, onError) => {
    //UPDATE RECOMMENDED TICKETS FIELD
    let data
    console.log("trainingData")
    console.log(trainingData)
    if (trainingData === undefined) {
        data = {
            ticket: {
                _id: ticket._id,
                question: ticket.question,
                markupNFormat: ticket.markupNFormat,
                markupTFormat: context,
                recommendedTickets: [],
                includedForSolutions: ticket.includedForSolutions
            },
            trainingData: trainingData
        }
    } else {
        data = {
            ticket: {
                _id: ticket._id,
                markupNFormat: ticket.markupNFormat,
                markupTFormat: context,
                recommendedTickets: [],
                includedForSolutions: ticket.includedForSolutions
            },
            trainingData: trainingData
        }
    }
    console.log("fetch learn Ticket")
    console.log(data)
    fetch(uri + 'api/bandit/learnTicket', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response)
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session Expired")
        }
        throw new Error('Learn Ticket Failed')

    }).then((data) => {
        return onSuccess(data)
    }).catch((err) => {
        return onError(err)
    })
}

export function deleteTicket(id, onSuccess, onError) {
    let data = {
        _id: id
    }
    fetch(uri + 'api/tickets/deleteTicket', {
        method: 'DELETE',
        headers: authHeader(),
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response)
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session Expired")
        }

    }).then((data) => {
        return onSuccess(data)
    }).catch((err) => {
        return onError(err)
    })
}

export function getMarkUpFormat(frage, onSuccess, onError) {
    let data = {
        frage: frage
    }
    fetch(uri + 'api/tickets/getMarkUpFormat', {
        method: 'POSt',
        headers: authHeader(),
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response)
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session Expired")
        }

    }).then((data) => {
        return onSuccess(data)
    }).catch((err) => {
        return onError(err)
    })
}

export function learnAndSavePrediction(ticket, onSuccess, onError) {
    console.log(ticket)
    fetch(uri + 'api/bandit/learnAndSavePrediction', {
        method: 'POSt',
        headers: authHeader(),
        body: JSON.stringify({ticket: ticket})
    }).then((response) => {
        console.log(response)
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session Expired")
        }

    }).then((data) => {
        return onSuccess(data)
    }).catch((err) => {
        return onError(err)
    })
}

export function saveTicket(ticket, onSuccess, onError) {

    fetch(uri + 'api/ticket/saveTicket', {
        method: 'POSt',
        headers: authHeader(),
        body: JSON.stringify({ticket: ticket})
    }).then((response) => {
        switch (response.status) {
            case 200:
                return response.json()
            case 401:
                alert("Session Expired")
                return logout("Session Expired")
        }

    }).then((data) => {
        return onSuccess(data)
    }).catch((err) => {
        return onError(err)
    })
}

// getStatistic (AdminProtected)

// saveSettings (AdminProtected)