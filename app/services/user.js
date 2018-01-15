import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl

const userService = {
    login: data => {
        //3er param - options - { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        return axios.post(apiUrl + '/login', data)
    },
    signup: (data, query) => {
        return axios.post(apiUrl + '/signup', data, { params: query })
    },
    confirm: (id, data) => {
        return axios.put(`${apiUrl}/signup/confirm/${id}`, data)
    },
    getUserInfo: token => {
        return axios.get(apiUrl + '/profile', { headers: { "Authorization": token } })
    }
}

export default userService