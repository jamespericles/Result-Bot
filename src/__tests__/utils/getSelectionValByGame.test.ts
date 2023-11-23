import getSelectionValByGame from 'util/getSelectionValByGame'
import { Selections } from 'util/getSelectionValByGame'

describe('getSelectionValByGame', () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        event: {
          sets: {
            nodes: [
              {
                games: [
                  {
                    selections: [
                      {
                        selectionValue: 1,
                        entrant: {
                          participants: [
                            {
                              entrants: [
                                {
                                  id: 1,
                                  name: 'test-entrant',
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
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

  it('should return an array of selections', async () => {
    jest.mock('node-fetch', () => mockSuccess)

    const result = await getSelectionValByGame('test-slug')

    const expected: Selections[] = [
      {
        selectionValue: 1,
        id: 1,
        name: 'test-entrant',
      },
    ]

    expect(result).toEqual(expected)
  })

  it('should handle null selections', async () => {
    const mockResponseWithNullSelections = {
      json: jest.fn().mockResolvedValue({
        data: {
          event: {
            sets: {
              nodes: [
                {
                  games: [
                    {
                      selections: null,
                    },
                  ],
                },
              ],
            },
          },
        },
      }),
    }
    const mockSuccessWithNullSelections = jest.fn().mockResolvedValue(mockResponseWithNullSelections)
  
    jest.mock('node-fetch', () => mockSuccessWithNullSelections)
  
    const result = await getSelectionValByGame('test-slug')
  
    expect(result).toEqual([])
  })

  it('should log error when no event data is found', async () => {
    const mockResponseWithNoEventData = {
      json: jest.fn().mockResolvedValue({
        data: {},
      }),
    }
    const mockFailure = jest.fn().mockResolvedValue(mockResponseWithNoEventData)
  
    jest.mock('node-fetch', () => mockFailure)
  
    const consoleSpy = jest.spyOn(console, 'error')
  
    const result = await getSelectionValByGame('test-slug')
  
    expect(consoleSpy).toHaveBeenCalledWith('No event found, selection sample not generated')
    expect(result).toBeUndefined()
  
    consoleSpy.mockRestore()
  })
})
