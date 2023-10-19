import { sanitizeTournamentName } from 'util/index'

describe('sanitizeTournamentName', () => {
    it('should return a string with the first letter capitalized', () => {
        const rawInput = ['test', 'test_test']
        const sanitizedInput = ['Test', 'Test Test']

        rawInput.forEach((input, index) => {
            expect(sanitizeTournamentName(input)).toEqual(sanitizedInput[index])
        })
    })
})