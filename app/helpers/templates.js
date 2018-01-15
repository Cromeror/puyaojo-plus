import { serverConfig } from '../../config/localConfig'
import { ENV } from '../../config/env'
import { numberWithCommas, toCamelCase } from './helpers'
import moment from 'moment'

/* Traductions */
import traductions from 'helpers/traductions.json'

export default function getTemplate(type, recipient, lang, data) {
    //console.log('getTemplate type ' + type)
    var templates = {
        contact: {
            client: getContactUserTemplate,
            provider: getContactProviderTemplate
        },
        booking: {
            client: getBookingTemplate,
            provider: getBookingTemplate
        }
    }

    return (templates[type] && templates[type][recipient]) ? templates[type][recipient](lang, data) : null
}

const header = logo => {
    return `<div style='max-width: 670px;box-sizing: border-box !important;overflow:hidden;background-color: #ededed;border: 1px solid #929292;'>
        <div style='width: 100%;padding: 50px 0;background-color: ${(ENV === "development" ? "red" : "black")}; text-align: center;'>
        ${logo ? `<img style='width:300px;' src='${logo}' />` : ''}
        </div>`
}

export function getContactUserTemplate(language, data) {
    const strings = traductions.templates['contactUs']

    let body =
        `<div style='background-color:gray'>
            <div style='background-color: #ffffff;padding: 25px;text-align:center;width: 100%;font-size: 1rem;box-sizing: border-box;'>
                <p>${strings.thankYou[language]}</p>
            </div>
        </div></div>`

    return header(data.logo) + body
}

export function getContactProviderTemplate(language, data) {
    const strings = traductions.templates['contactUs']
    const forms = traductions.forms

    let body =
        `<div style='background-color:gray'>
            <div style='background-color: #ffffff;padding: 25px;width: 100%;font-size: 1rem;box-sizing: border-box;'>
                <h3 style='text-align:center;'>${strings.contactRequest[language]}</h3>
                <p><b>${forms.user[language]}:</b> ${data['first_name']} ${data['last_name']}</p>
                <p><b>${forms.email[language]}:</b> ${data['email']}</p>
                ${(data['phone'] ? `<p><b>${forms.phone[language]}:</b> ${data['phone']}</p>` : ``)}
                <p><b>${forms.country[language]}:</b> ${data['country']}</p>
                <p><b>${forms.message[language]}:</b> <br>"${data['message']}"</p>
            </div>
        </div></div>`

    return header(data.logo) + body
}

export function getBookingTemplate(language, data) {
    moment.locale(language)
    const strings = traductions.templates['booking']
    const paymentStr = traductions.components['PaymentSection']
    const forms = traductions.forms
    let providerBody = strings.providerBody[language]

    if (data.payment_type != 'Bank') {
        var clientBody = strings.clientBody.PayPal[language]
    } else {
        var clientBody = strings.clientBody.Bank[language]
    }

    let orderInfo =
        `<div style='width: 100%;float: left;padding: 0 15px;box-sizing: border-box;margin-bottom: 25px;'>
        	<table style='line-height: 1.1rem;background-color: white;padding: 5px;box-sizing: border-box;width: 100%;'>
            ${data.isProvider ? `<tr><td><b>${strings.paymentType[language]}:</b></td><td>${data.payment_type}</td></tr>` : ''}
            <tr><td><h4 style="margin: 5px 0; padding: 0">${data.package_name}</h4></td><td></td></tr>
            <tr><td><h4 style="margin: 0; padding: 0;">${paymentStr.hotel[language]}:</h4></td><td>${data.selectHotel.name}</td></tr>
            <tr><td></td><td>${data.currentPackage.days} ${paymentStr.days[language]} - ${parseInt(data.currentPackage.days) - 1} ${paymentStr.nights[language]}</td></tr>
            <tr><td>${paymentStr.arrival[language]}: </td><td><b>${moment(data.currentPackage['check-in']).format('MMMM D, YYYY')}</b></td></tr>
            <tr><td>${paymentStr.departure[language]}: </td><td><b>${moment(data.currentPackage['check-out']).format('MMMM D, YYYY')}</b></td></tr>
            <tr><td>${strings.priceFor[language]} ${data.people} ${paymentStr.guests[language]} </td><td>${data.currency} ${numberWithCommas(data.cost.toFixed(2))}</td></tr>
            <tr><td>${paymentStr.fee[language]} (5%)</td><td>${data.currency} ${numberWithCommas(data.fee.toFixed(2))}</td></tr>
            <tr><td style="border-bottom: 1px solid #ededed; padding: 0px 0px 10px 0px;"><b>${paymentStr.total[language]}</b> </td><td style="border-bottom: 1px solid #ededed; padding: 0px 0px 10px 0px;"><b>${data.currency} ${numberWithCommas(data.amount.toFixed(2))}</b></td></tr>
            <tr><td><h4 style="margin: 5px 0; padding: 5px 0;">${strings.guestInformation[language]}</h4></td><td></td></tr>
            <tr><td>${strings.guests[language]}: </td><td>${data.people}</td></tr>
            ${getGuestInfo(language, data)}
            <tr><td><h4 style="margin: 5px 0; padding: 5px 0;">${strings.contactInformation[language]}</h4></td></tr>
            <tr><td>${forms.email[language]}:</td><td>${data.email}</td></tr>
            <tr><td>${forms.phoneType[language]}:</td><td>${strings.phoneTypes[data.phone_type][language]}</td></tr>
            <tr><td>${forms.countryCode[language]}:</td><td>${data.country_code}</td></tr>
            <tr><td>${forms.area[language]}:</td><td>${data.area}</td></tr>
            <tr><td>${forms.number[language]}:</td><td>${data.phone}</td></tr>
        </table>
        </div>`

    let body =
        `<div style='background-color:#ededed'>
            <div style='padding: 10px;width:100%;font-size: 1rem;box-sizing: border-box;'>
                <p style="padding-left: 15px;margin: 5px 0">${data.isProvider ? providerBody : clientBody}</p>
                ${!data.isProvider ? `<h4 style="padding-left: 15px;margin: 20px 0 10px 0">${strings.yourOrder[language]}:</h4>` : ''}
                ${orderInfo}
            </div>
        </div></div>`

    return header(data.logo) + body
}

function getGuestInfo(language, data) {
    const strings = traductions.templates['booking']
    const forms = traductions.forms
    let guests =
        `<tr><td><h4 style="margin: 5px 0; padding: 5px 0;">${strings.guest[language]} 1</h4></td></tr>
        <tr><td>${forms.name[language]}: </td><td>${data.first_name_1}</td></tr>
        <tr><td>${forms.lastname[language]}: </td><td>${data.last_name_1}</td></tr>
        <tr><td>${forms.documentType[language]}: </td><td>${data.document_type_1}</td></tr>
        <tr><td>${forms.documentCountry[language]}: </td><td>${data.passport_country_1}</td></tr>
        <tr><td>${forms.number[language]}: </td><td>${data.document_number_1}</td></tr>`

    if (data.people == 2) {
        guests += `<tr><td><h4 style="margin: 5px 0; padding: 5px 0;">${strings.guest[language]} 2</h4></td></tr>
            <tr><td>${forms.name[language]}: </td><td>${data.first_name_2}</td></tr>
            <tr><td>${forms.lastname[language]}: </td><td>${data.last_name_2}</td></tr>
            <tr><td>${forms.documentType[language]}: </td><td>${data.document_type_2}</td></tr>
            <tr><td>${forms.documentCountry[language]}: </td><td>${data.passport_country_2}</td></tr>
            <tr><td>${forms.number[language]}: </td><td>${data.document_number_2}</td></tr>`
    }

    return guests
}