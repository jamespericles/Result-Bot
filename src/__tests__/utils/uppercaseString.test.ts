import { uppercaseString } from 'util/index'

describe('uppercaseString', () => {
    it('should return a string with the first letter capitalized', () => {
        const result = uppercaseString('test')

        expect(result).toEqual('Test')
    })
})