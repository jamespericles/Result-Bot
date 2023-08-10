import { getEventStanding } from 'util/index'
import { GetEventStandingReturnType } from 'types'

describe('getEventStanding', () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        event: {
          id: 12345,
          name: 'test-event',
          standings: {
            nodes: [
              {
                placement: 1,
                entrant: {
                  id: 12345,
                  name: 'test-entrant',
                },
              },
            ],
          },
        },
      },
    }),
  }
  const mockSuccess = jest.fn().mockResolvedValue(mockResponse)

  beforeEach(() => {
    jest.resetModules()
    process.env.STARTGG_KEY = 'test-key'
    process.env.STARTGG_URI = 'https://example.com/graphql'
  })

  afterEach(() => {
    delete process.env.STARTGG_KEY
    delete process.env.STARTGG_URI
  })

  it('should return the event standings when the event exists', async () => {
    jest.mock('node-fetch', () => mockSuccess)

    const eventStanding = await getEventStanding(12345)

    expect(eventStanding).toEqual({
      data: {
        event: {
          id: 12345,
          name: 'test-event',
          standings: {
            nodes: [
              {
                placement: 1,
                entrant: {
                  id: 12345,
                  name: 'test-entrant',
                },
              },
            ],
          },
        },
      },
    })
    expect(mockSuccess).toHaveBeenCalledTimes(1)
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

    await expect(getEventStanding(12345)).rejects.toThrow('Event not found')
  })
})
