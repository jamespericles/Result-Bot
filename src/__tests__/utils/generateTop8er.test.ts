import { generateTop8er } from 'util/index'
import { sanitizedCharacterName } from 'util/generateTop8er'
//
import fs from 'fs';
import dotenv from 'dotenv';
import { Base64String } from 'discord.js';
import { Standings } from 'util/getEventStanding';
import { Selections } from 'util/getSelectionValByGame';
import { Characters } from 'util/getCharacters';

dotenv.config()
jest.mock('node-fetch', () => ({
    default: jest.fn()
}))

const { TOP8ER_URI } = process.env

describe('generateTop8er', () => {
    const mockEventStanding: Standings = [
      {
        placement: 1,
        entrant: {
          id: 1,
          name: 'Player 1',
          participants: [{
            user: {
              slug: 'user/1',
            },
          }]
        },
      },
      {
        placement: 2,
        entrant: {
          id: 2,
          name: 'Player 2',
          participants: [{
            user: {
              slug: 'user/2',
            },
          }]
        },
      },
    ];
  
    const mockSelectionSample: Selections[] = [
      {
        id: 1,
        selectionValue: 1,
        name: 'Character 1',
      },
      {
        id: 2,
        selectionValue: 2,
        name: 'Character 2',
      },
    ];
  
    const mockCharacterArray: Characters = [
      {
        id: 1,
        name: 'Character 1',
      },
      {
        id: 2,
        name: 'Character 2',
      },
    ];
})

describe('sanitizedCharacterName', () => {
    it('sanitizedCharacterName should return the correct character name if it exists in the map', () => {
        expect(sanitizedCharacterName('Pyra & Mythra')).toBe('Pyra and Mythra')
        expect(sanitizedCharacterName('Random Character')).toBe('Random')
    })
    
    it('should return the original character name if it does not exist in the map', () => {
        expect(sanitizedCharacterName('Character')).toBe('Character')
    })
})