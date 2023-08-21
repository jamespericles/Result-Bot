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
})
