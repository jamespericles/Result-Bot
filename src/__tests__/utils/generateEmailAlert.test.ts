import { generateEmailAlert } from 'util/index'
import nodemailer from 'nodemailer'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
      callback(null, { message: 'Email sent' })
    }),
  }),
}))

describe('generateEmailAlert', () => {})
