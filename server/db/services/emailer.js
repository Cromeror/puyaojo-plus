var sendinblue = require('sendinblue-api')

var parameters = { "apiKey": "gj3z7EfSmVAypqCs", "timeout": 5000 } //Optional parameter: Timeout in MS 
var sendinObj = new sendinblue(parameters)

function getSIBAccount() {
  var input = {}

  return sendinObj.get_account(input, function (err, response) {
    return response
  })
}

export function sendEmail(data) {
  sendinObj.send_email(data, function (err, response) {
    console.log(response)
    return response
  })
}

export function sendEmail2(data, callback) {
  return sendinObj.send_email(data, callback)
}