import { sendEmail2 } from '../../services/emailer'

export function sendMail(req, res, next) {
    sendEmail2(req.body, (err, response) => {
        var sent = (response.code === 'success') ? true : false
        return res.status(sent ? 200 : 401).json({ 'sent': sent })
    })
}

export default {
    sendMail
}