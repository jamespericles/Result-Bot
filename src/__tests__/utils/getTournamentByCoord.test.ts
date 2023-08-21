import { getTournamentsByCoord } from 'util/index'
import { sanitizeSlug } from 'util/getTournamentsByCoord'
jest.mock('node-fetch')

describe('getTournamentByCoord', () => {
  jest.mock('dotenv', () => ({
    config: jest.fn(),
  }))
  process.env.STARTGG_KEY = 'test-key'
  process.env.STARTGG_URI = 'test-uri'

  jest.mock('node-fetch', () => {
    return jest.fn().mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              tournaments: {
                nodes: [
                  {
                    id: 1,
                    name: 'test-tournament',
                  },
                ],
              },
            },
          })
        )
      )
    })
  })

  it('should return data', async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          tournaments: {
            nodes: [
              {
                id: 1,
                name: 'Alulu Tournament #1',
              },
            ],
          },
        },
      }),
    }
    const mockSuccess = jest.fn().mockResolvedValue(mockResponse)
    jest.mock('node-fetch', () => mockSuccess)

    const result = await getTournamentsByCoord(
      1,
      'test-coordinates',
      'test-radius',
      'test-week'
    )

    console.log(result)
  })

  it('should return null if no matching tournament is found', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              tournaments: {
                nodes: [],
              },
            },
          })
        )
      )
    )

    const result = await getTournamentsByCoord(
      1,
      'test-coordinates',
      'test-radius',
      'test-week'
    )

    const expected = {
      id: null,
      name: null,
    }

    expect(result).toEqual(expected)
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
    }

    expect(result).toEqual(expected)
  })

  it('sanitizeSlug() should work', () => {
    const dirtySlugs = ['Hello, World', 'This is a Test', '1234', '!@#$%^&*()']

    const sanitizedSlugs = ['hello-world', 'this-is-a-test', '1234', '-']

    for (let i = 0; i < dirtySlugs.length; i++) {
      const dirty = dirtySlugs[i]
      const clean = sanitizedSlugs[i]

      expect(sanitizeSlug(dirty)).toEqual(clean)
    }
  })
})
