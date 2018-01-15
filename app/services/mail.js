import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

var apiUrl = serverConfig.apiUrl

export function sendMail(data, requestSent) {
    axios.post(apiUrl + '/mails', data).then(response => {
        if (requestSent) {
            requestSent(response.data.sent)
        }
    }).catch(error => {
        console.log('sendMail', error)
        if (requestSent) {
            requestSent(false)
        }
    })
}

export default {
    sendMail
}