import moment from 'moment'
import { browserHistory } from 'react-router'
import { serverConfig } from '../../config/localConfig'

export function pushPath(path, query = false) {
    if (query && browserHistory) {
        browserHistory.push({ pathname: path, query: query })
    } else {
        if (browserHistory) {
            browserHistory.push(path)
        }
    }
}

export function numberWithCommas(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } else {
        return ''
    }
}

export function trimImageUrl(url) {
    if (url) {
        var protocol = serverConfig.production ? 'https' : 'http'
        url = url.replace('s3://jetsemani-cdn/', '')
        url = url.replace('http://cdn.jetsemani.com/', '')
        url = url.replace('https://cdn.jetsemani.com/', '')
        url = url.replace('-400x200', '')
        url = url.replace('-400x300', '')
        url = url.replace('wp-content/uploads/', '')
        url = protocol + '://jetsemani.imgix.net/wp-content/uploads/' + url + '?fit=crop&auto=format&q=50'
    }

    return url
}

export function trimThumbUrl(thumbnail, specificSize) {

    if (thumbnail) {
        var protocol = serverConfig.production ? 'https' : 'http'
        var thumb_url = thumbnail.file.replace('s3://jetsemani-cdn/wp-content/uploads/', '')
        thumb_url = thumb_url.replace('http://cdn.jetsemani.com/wp-content/uploads/', '')
        var size = specificSize ? specificSize : 'box-thumb'

        if (thumbnail.sizes && thumbnail.sizes[size]) {
            thumb_url = thumb_url.split('/')
            thumb_url[thumb_url.length - 1] = thumbnail.sizes[size].file
            thumb_url = thumb_url.join('/')
        }

        return protocol + '://jetsemani.imgix.net/wp-content/uploads/' + thumb_url
    }

    return ''
}

export function htmlEscape(str) {
    if (str) {
        return str.replace(/&amp;/g, '&') // first!
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#8220;/g, '“')
            .replace(/&#8221;/g, '”')
    }
    return str
}

export function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000)
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getUTCDay()
    var hour = a.getHours()
    var min = a.getMinutes()
    var sec = a.getSeconds()
    var time = date + ' ' + month + ' ' + year
    return time
}

export function dateFormatter(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var year = date.getFullYear()
    var month = months[date.getMonth()]
    var date = date.getUTCDay()
    date = date + ' ' + month + ' ' + year
    return date
}

export function formatTimeFromSQL(time) {
    time = time.split(':')
    time[0] = parseInt(time[0])
    time[2] = time[0] == 24 || time[0] < 12 ? ' am' : ' pm'
    time[0] = time[0] <= 12 ? (time[0] == 0 ? 12 : time[0]) : time[0] - 12
    time[1] = time[1] == '00' ? '' : ':' + time[1]

    return time[0] + time[1] + time[2]
}

export function formatTimeArray(time) {
    time = time.split(':')
    time[0] = parseInt(time[0])
    time[2] = time[0] == 24 || time[0] < 12 ? ' am' : ' pm'
    time[0] = time[0] <= 12 ? (time[0] == 0 ? 12 : time[0]) : time[0] - 12
    time[1] = time[1] == '00' ? '' : ':' + time[1]

    return time
}

function isArray(obj) {
    return !!obj && Array === obj.constructor
}

export function isObjEmpty(obj) {
    return (obj && (obj.constructor === Object && Object.keys(obj).length === 0) || (isArray(obj) && obj.length === 0))
}

export function arrayToObject(data, field_key = 'id') {
    if (isArray(data) && data.length > 0) {
        var obj = {}
        for (var i = 0; i < data.length; i++) {
            obj[data[i][field_key]] = data[i]
        }

        return obj
    } else {
        return false
    }
}

export function getWPIds(data) {
    var ids = ''

    if (isArray(data) && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].wp_post_id) {
                ids += data[i].wp_post_id + ","
            }
        }
        ids = ids.slice(0, ids.length - 1)
    }

    return ids
}

export function getDateFromDay(day, date) {
    return date = moment(date, 'YYYY-MM-DD').startOf('day').add(day, 'days')
}

export function normalizeString(slug) {
    var newString = ''
    var normalizeChars = {
        'Š': 'S', 'š': 's', 'Ð': 'Dj', 'Ž': 'Z', 'ž': 'z', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A',
        'Å': 'A', 'Æ': 'A', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I',
        'Ï': 'I', 'Ñ': 'N', 'Ń': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U',
        'Û': 'U', 'Ü': 'U', 'Ý': 'Y', 'Þ': 'B', 'ß': 'Ss', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'å': 'a', 'æ': 'a', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i',
        'ï': 'i', 'ð': 'o', 'ñ': 'n', 'ń': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'ù': 'u',
        'ú': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y', 'ý': 'y', 'þ': 'b', 'ÿ': 'y', 'ƒ': 'f', 'ă': 'a', 'î': 'i', 'â': 'a',
        'ș': 's', 'ț': 't', 'Ă': 'A', 'Î': 'I', 'Â': 'A', 'Ș': 'S', 'Ț': 'T', '&-': '', "'": ''
    }

    slug = slug.toLowerCase().replace(/ /g, "-")
    slug = slug.split('')

    for (var char of slug) {
        if (normalizeChars[char]) {
            newString += normalizeChars[char]
        } else {
            newString += char
        }
    }

    return newString
}

export function toCamelCase(str) {
    return str.split(' ').map(function (word, index) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }).join('')
}

/**
 * Se añade un nuevo parametro a la localizacion actual, si el parametro existe se remplaza
 * @param {Object} newParams
 * @param {Object} location 
 */
export function addOrUpdateQueryParam(location, newParams) {
    const newLocation = Object.assign({}, location)

    for (var key in newParams) {
        var param = newParams[key]
        newLocation.query[key] = param
    }

    browserHistory.push(newLocation)
}

export function getToken() {
    if (supportLocalStorage()) {
        return localStorage.getItem("JC-Token")
    } else {
        return null
    }
}

export function saveToken(token) {
    //Necesitamos enviar en el token el esquema del portador
    token = token ? `Bearer ${token}` : ''

    if (supportLocalStorage()) {
        localStorage.setItem("JC-Token", token)
    }
}

/**
 * Compara dos objetos
 * @param {*} a 
 * @param {*} b 
 * @param {*} attr atributo del objeto usado como criterio de comparacion
 */
export const objectSorter = (a, b, attr) => {
    a[attr] = a[attr] ? a[attr] : ''
    b[attr] = b[attr] ? b[attr] : ''
    // Use toUpperCase() to ignore character casing
    const genreA = a[attr].toString().toUpperCase();
    const genreB = b[attr].toString().toUpperCase();

    let comparison = 0;
    if (genreA > genreB) {
        comparison = 1;
    } else if (genreA < genreB) {
        comparison = -1;
    }
    return comparison;
}

function supportLocalStorage() {
    if (typeof window === 'object' && window.localStorage) {
        return true
    } else {
        if (typeof window === 'object') {
            alert('¡Estas usando una versión muy antigua de tu navegador!, para que la aplicación funcione de manera correcta deberías actualizarlo :)')
        }
        return false
    }
}