import { generateEmailAlert, sanitizeTournamentName } from 'util/index'

async function exitHandler(evtOrExitCodeOrError: number | string | Error) {
  if (evtOrExitCodeOrError instanceof Error) {
    await generateEmailAlert(
      `${sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)} Bot has exited.`,
      JSON.stringify(evtOrExitCodeOrError)
    )
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
