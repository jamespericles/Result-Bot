import { getNumberFromRedirect } from 'util/index'

describe('getNumberFromRedirect', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'
  })

  afterEach(() => {
    delete process.env.STARTGG_KEY
    delete process.env.STARTGG_URI
  })

  it('should return a number', async () => {
    jest.mock('node-fetch', () => jest.fn().mockResolvedValueOnce({
      ok: true,
      url: 'https://start.gg/tournament/test-12345',
    }))

    const url = 'https://start.gg/alulu'
    const expectedNumber = 12345

    const result = await getNumberFromRedirect(url)
    console.log("file: getNumberFromRedirect.test.ts:27 ~ it ~ result:", result)

    expect(result).toBe(expectedNumber)
  })

  it('should return undefined if response is not ok', async () => {
    const url = 'https://start.gg/alulu'

    jest.mock('node-fetch', () => jest.fn().mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    }))

    const result = await getNumberFromRedirect(url)

    expect(result).toBeUndefined()
  })

  it('should return undefined if match is not found', async () => {
    const url = 'https://start.gg/alulu'

    jest.mock('node-fetch', () => jest.fn().mockResolvedValueOnce({
      ok: true,
      url: 'https://start.gg/tournament/test',
    }))

    const result = await getNumberFromRedirect(url)

    expect(result).toBeUndefined()
  })
})