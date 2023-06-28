import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_RECIPIENT } = process.env

type MailOptionsType = {
  from: string
  to: string
  subject: string
  text: string
}

const generateEmailAlert = (mailOptions?: MailOptionsType): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  })

  const sendMailPromise = new Promise((resolve, reject) => {
    if (!mailOptions) {
      mailOptions = {
        from: SMTP_USERNAME as string,
        to: SMTP_RECIPIENT as string,
        subject: 'Alulu Bot has exited',
        text: 'Alulu Bot has exited',
      }
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })

  return sendMailPromise
    .then((info) => {
      console.log('Email sent successfully!')
    })
    .catch((err) => {
      console.error(err)
    })
}

export default generateEmailAlert
