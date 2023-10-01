import nodemailer from 'nodemailer'
import { generateEmailAlert } from 'util/index'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((options, callback) => callback(null, 'Email sent successfully'))
  }))
}))

describe('generateEmailAlert', () => {
  afterEach(() => {
    delete process.env.SMTP_USERNAME
    delete process.env.SMTP_PASSWORD
    delete process.env.SMTP_RECIPIENT
  })

  it('should send an email', async () => {
    const subject = 'Test email'
    const text = 'This is a test email'

    await generateEmailAlert(subject, text)

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  })
})