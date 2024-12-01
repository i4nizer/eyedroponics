const config = require('../config/config')
const nodemailer = require('nodemailer')


const mailer = {

    // Transporter Settings
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    }),

    // Send an email
    send: (to, subject, text, html = null) => {

        // Set options and msg
        const mailOpts = {
            from: config.emailUser,
            to, subject, text, html: html ?? ''
        }

        // Send it
        mailer.transporter.sendMail(mailOpts, mailer.onSend)
    },

    // Handle errors
    onSend: (error, info) => {
        if (error) return console.log('Error sending email: ', error)
        console.log('Email sent: ', info.response)
    }

}


module.exports = mailer