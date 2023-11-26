import { sanitizedCharacterName } from 'util/index'

describe('sanitizedCharacterName', () => {
    it('sanitizedCharacterName should return the correct character name if it exists in the map', () => {
        expect(sanitizedCharacterName('Pyra & Mythra')).toBe('Pyra and Mythra')
        expect(sanitizedCharacterName('Random Character')).toBe('Random')
    })
    
    it('should return the original character name if it does not exist in the map', () => {
        expect(sanitizedCharacterName('Character')).toBe('Character')
    })
})