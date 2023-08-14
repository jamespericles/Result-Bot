import * as queryString from 'graphql/queries/getEventStanding'
import dotenv from 'dotenv'
dotenv.config()
// This is ugly and I hate it, see: https://github.com/node-fetch/node-fetch/blob/HEAD/docs/v3-UPGRADE-GUIDE.md
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { STARTGG_KEY, STARTGG_URI } = process.env

type EventData = {
  data: {
    event: {
      id: number
      name: string
      standings: {
        nodes: {
          placement: number
          entrant: {
            id: number
            name: string
          }
        }[]
      }
    }
  }
}

export type Standings = Extract<
  EventData['data']['event']['standings']['nodes'],
  any[]
>

const getEventStanding = async (
  eventId: number,
  page: number = 1,
  perPage: number = 8
): Promise<Standings | undefined> => {
  if (STARTGG_KEY && STARTGG_URI) {
    const query = queryString.default!.loc!.source!.body

    if (query) {
      const response = await fetch(STARTGG_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STARTGG_KEY}`,
        },
        body: JSON.stringify({
          query,
          variables: {
            eventId,
            page,
            perPage,
          },
        }),
      })

      const {
        data: {
          event: {
            standings: { nodes },
          },
        },
      } = (await response.json()) as EventData

      if (!nodes) {
        throw new Error(`Event not found`)
      } else {
        return nodes
      }
    }
  }
}

export default getEventStanding
