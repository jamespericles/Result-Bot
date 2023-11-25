import { generateTop8er } from 'util/index';
import { Standings } from 'util/getEventStanding';
import { Selections } from 'util/getSelectionValByGame';
import { Characters } from 'util/getCharacters';

describe('generateTop8er', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.TOP8ER_URI = 'https://example.com'
    process.env.TOURNAMENT_NAME = 'alulu'
  })

  afterEach(() => {
    delete process.env.TOP8ER_URI
    delete process.env.TOURNAMENT_NAME
  })

  const mockResponse = {
    json: jest.fn().mockResolvedValue({})
  }

  it('', () => {
    expect(true).toBe(true)
  })
})