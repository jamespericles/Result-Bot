import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_RECIPIENT } = process.env;

type MailOptionsType = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

const generateEmailAlert = (
  subject: string,
  text: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const mailOptions: MailOptionsType = {
      from: SMTP_USERNAME as string,
      to: SMTP_RECIPIENT as string,
      subject,
      text,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    transporter.sendMail(mailOptions, () => {
        console.log('*** Alert email sent ***');
        resolve()
    })
  })
}

export default generateEmailAlert;
