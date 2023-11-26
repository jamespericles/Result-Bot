import { generateTop8er } from 'util/index'
import { Standings } from 'util/getEventStanding'
import { Selections } from 'util/getSelectionValByGame'
import { Characters } from 'util/getCharacters'
import { eventStanding, selectionSample, finalPayload, characterArray } from '__tests__/fixtures'
import * as getCharacters from 'util/getCharacters'
import * as generateMergedPayload from 'util/generateMergedPayload'
import * as sanitizeTournamentName from 'util/sanitizeTournamentName'

describe('generateTop8er', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.TOP8ER_URI = 'https://www.top8er.com/api/generate/top8er/ssbu/'
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'
    process.env.TOURNAMENT_NAME = 'alulu'
  })

  afterEach(() => {
    delete process.env.TOP8ER_URI
    delete process.env.TOURNAMENT_NAME
  })

  const mockSuccess = jest.fn().mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue({
      base64_img: 'test-image'
    })
  })

  const mockFailure = jest.fn().mockResolvedValue({
    status: 500,
    json: jest.fn().mockResolvedValue({
      error: 'test-error'
    })
  })

  const characterSpy = jest.spyOn(getCharacters, 'default')
  characterSpy.mockResolvedValue(characterArray as Characters)

  // const generateMergedPayloadSpy = jest.spyOn(generateMergedPayload, 'default')
  // generateMergedPayloadSpy.mockReturnValue(finalPayload)

  // const sanitizeTournamentNameSpy = jest.spyOn(sanitizeTournamentName, 'default')
  // sanitizeTournamentNameSpy.mockReturnValue('Alulu')

  const consoleSpy = jest.spyOn(console, 'log')
  
  it('it should return data', async () => {
    jest.mock('node-fetch', () => ({
      __esModule: true,
      default: mockSuccess,
    }))

    const generateImage = await generateTop8er(eventStanding, selectionSample, 154)

    expect(generateImage).toEqual({
      success: true,
      image: 'test-image'
    })
  })

  it('it should return an error', async () => {
    jest.mock('node-fetch', () => ({
      __esModule: true,
      default: mockFailure,
    }))

    const generateImage = await generateTop8er(eventStanding, selectionSample, 154)

    expect(generateImage).toEqual({
      success: false,
      error: new Error('Error: 500')
    })
  })
})