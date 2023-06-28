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

const generateEmailAlert = async (
  mailOptions: MailOptionsType = {
    from: SMTP_USERNAME as string,
    to: SMTP_RECIPIENT as string,
    subject: 'Alulu Bot has exited',
    text: 'Alulu Bot has exited',
  }
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  })

  const sendMailPromise = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })

  try {
    const info_1 = await sendMailPromise
    console.log('*** Alert email sent ***')
  } catch (err_1) {
    console.error(err_1)
  }
}

export default generateEmailAlert
