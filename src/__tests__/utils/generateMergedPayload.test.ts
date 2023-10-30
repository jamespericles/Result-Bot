import { generateMergedPayload } from 'util/index'
import { determineCharacterName } from 'util/generateMergedPayload'
import { 
  eventStanding,
  characterArray,
  selectionSample ,
  finalPayload
} from '__tests__/fixtures'

const expected = [
  {
    name: 'Rickles',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'ALU | Doomy',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'RZI',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'CUBBY | HyperRose',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'CHA | SJP',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'ALU | Towelie',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'GG | ThymeMaster',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  },
  {
    name: 'paper_plate',
    social: '',
    character: [ [Array], null, null ],
    flag: [ null, null ]
  }
]

describe('generateMergedPayload', () => {
  it('should return an array of objects with the correct shape', () => {
    const result = generateMergedPayload(eventStanding, selectionSample, characterArray)

    for (let i = 0; i < result.length; i++) {
      for(let j = 0; j < finalPayload.length; j++) {
        expect(result[i].name).toEqual(finalPayload[i].name)
        expect(result[i].social).toEqual(finalPayload[i].social)
        expect(result[i].character).toEqual(finalPayload[i].character)
        expect(result[i].flag).toEqual(finalPayload[i].flag)
      }
    }
  })

  it('determineCharacterName should return the character name, or Random', () => {
    const foundCharacter = determineCharacterName({ id: 1271, name: 'Bayonetta' })
    const notFoundCharacter = determineCharacterName(undefined)

    expect(foundCharacter).toEqual('Bayonetta')
    expect(notFoundCharacter).toEqual('Random')
  })
})