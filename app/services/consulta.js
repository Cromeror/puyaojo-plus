import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl

const service = {
    find: (cc, token) => {
        return axios.get(`${apiUrl}/puestos/consultas?cc=${cc || ''}`, { headers: { "Authorization": token } })
    }
}

export default service