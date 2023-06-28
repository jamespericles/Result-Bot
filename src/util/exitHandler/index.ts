import generateEmailAlert from '../generateEmailAlert'
import dotenv from 'dotenv'
dotenv.config()

async function exitHandler(evtOrExitCodeOrError: number | string | Error) {
  if (evtOrExitCodeOrError instanceof Error) {
    try {
      await generateEmailAlert({
        from: process.env.SMTP_USERNAME as string,
        to: process.env.SMTP_RECIPIENT as string,
        subject: 'Alulu Bot has exited',
        text: 'Alulu Bot has exited',
      })
    } catch (e) {
      console.error('EXIT HANDLER ERROR', e)
    }
  }

  process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError)
}

;[
  'beforeExit',
  'uncaughtException',
  'unhandledRejection',
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
].forEach((evt) => process.on(evt, exitHandler))

export default exitHandler
