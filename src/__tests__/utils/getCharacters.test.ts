import { getCharacters } from 'util/index'

describe('getCharacters', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = originalEnv
  })

  it('should return characters when environment variables are set', async () => {
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'

    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          videogame: {
            characters: [
              { id: 1, name: 'Character 1' },
              { id: 2, name: 'Character 2' },
            ],
          },
        },
      }),
    })

    jest.mock('node-fetch', () => ({
      __esModule: true,
      default: mockFetch,
    }))

    const result = await getCharacters()

    expect(result).toEqual([
      { id: 1, name: 'Character 1' },
      { id: 2, name: 'Character 2' },
    ])
  })
})
