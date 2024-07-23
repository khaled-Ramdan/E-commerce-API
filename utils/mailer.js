// mailer.js
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
})


const sendMail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html,
    }

    return transporter.sendMail(mailOptions)
}

export default sendMail
