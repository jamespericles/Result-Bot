import { generateEmailAlert, exitHandler, sanitizeTournamentName } from 'util/index'

jest.mock('util/generateEmailAlert', () => jest.fn())

describe('exitHandler', () => {
    beforeAll(() => {
        process.exit = jest.fn() as any
    })

    it('should exit the process with the provided exit code', async () => {
        exitHandler(1)

        expect(process.exit).toHaveBeenCalledTimes(1)
        expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should exit the process with exit code 1 for non-numeric exit codes', () => {
        exitHandler('foo')

        expect(process.exit).toHaveBeenCalledTimes(2)
        expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('calls generateEmailAlert if the provided argument is an Error', async () => {
        const error = new Error('Test error')

        await exitHandler(error)

        expect(generateEmailAlert).toHaveBeenCalledWith(
            `${sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)} Bot has exited.`,
            JSON.stringify(error)
        )
    })
})
