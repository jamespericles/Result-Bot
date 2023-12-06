import { getTournamentsByCoord } from 'util/index'
import * as getEventID from 'util/getEventID'
import { sanitizeSlug } from 'util/getTournamentsByCoord'

describe('getTournamentByCoord', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'
    process.env.TOURNAMENT_NAME = 'alulu'
  })

  afterEach(() => {
    delete process.env.STARTGG_KEY
    delete process.env.STARTGG_URI
    delete process.env.TOURNAMENT_NAME
  })

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        tournaments: {
          nodes: [
            {
              id: 946457,
              name: 'Alulu #138',
              city: 'Chicago',
            },
          ],
        },
      },
    }),
  }

  const mockFetch = jest.fn().mockResolvedValue(mockResponse)

  jest.mock('node-fetch', () => ({
    __esModule: true,
    default: mockFetch,
  }))

  it('should return data', async () => {
    // Mock the nested getEventID call
    const spy = jest.spyOn(getEventID, 'default')
    spy.mockResolvedValue(946457)
    const { id, name, slug } = await getTournamentsByCoord(
      undefined, // This covers the page defaulting to 1 in the call signature
      '41.85488981724496,-87.66285400268926',
      '1mi',
      138
    )

    expect(name).toBe('alulu-138')
    expect(id).toBe(946457)
    expect(slug).toBe('tournament/alulu-138/event/ultimate-singles')
  })

  it('should return null if the environment variables are missing', async () => {
    delete process.env.STARTGG_KEY
    delete process.env.STARTGG_URI

    const result = await getTournamentsByCoord(
      1,
      'test-coordinates',
      'test-radius',
      'test-week'
    )

    const expected = {
      id: null,
      name: null,
      slug: null,
    }

    expect(result).toEqual(expected)
  })

  it('sanitizeSlug() should work', () => {
    const dirtySlugs = ['Hello, World', 'This is a Test', '1234', '!@#$%^&*()']

    const sanitizedSlugs = ['hello-world', 'this-is-a-test', '1234', '']

    for (let i = 0; i < dirtySlugs.length; i++) {
      const dirty = dirtySlugs[i]
      const clean = sanitizedSlugs[i]

      expect(sanitizeSlug(dirty)).toEqual(clean)
    }
  })
})
