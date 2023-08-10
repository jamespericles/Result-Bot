import { getEventID } from 'util/index'

describe('getEventID', () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        event: {
          id: 12345,
          name: 'test-event',
        },
      },
    }),
  }
  const mockFetch = jest.fn().mockResolvedValue(mockResponse)

  beforeEach(() => {
    jest.resetModules()
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'
  })

  afterEach(() => {
    delete process.env.STARTGG_KEY
    delete process.env.STARTGG_URI
  })

  it('should return the event ID when the event exists', async () => {
    jest.mock('node-fetch', () => mockFetch)

    const eventID = await getEventID('test-event')

    expect(eventID).toEqual(12345)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('should throw an error when the event does not exist', async () => {
    jest.mock('node-fetch', () =>
      jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: {
            event: null,
          },
        }),
      })
    )

    await expect(getEventID('failing-slug')).rejects.toThrow(
      'Event with slug failing-slug not found'
    )
  })
})
