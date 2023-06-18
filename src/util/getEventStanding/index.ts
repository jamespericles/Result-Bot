import * as queryString from '../../graphql/queries/getEventStanding'
import dotenv from 'dotenv'
dotenv.config()
// This is ugly and I hate it, see: https://github.com/node-fetch/node-fetch/blob/HEAD/docs/v3-UPGRADE-GUIDE.md
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { STARTGG_KEY, STARTGG_URI } = process.env

type Entrant = {
  id: number
  name: string
}

type StandingsNode = {
  placement: number
  entrant: Entrant
}

type Standings = {
  nodes: StandingsNode[]
}

type Event = {
  id: number
  name: string
  standings: Standings
}

type EventData = {
  data: {
    event: Event
  }
}

const getEventStanding = async (
  eventID: number,
  page: number = 1,
  perPage: number = 3
): Promise<void> => {
  if (STARTGG_KEY && STARTGG_URI) {
    const query = queryString.default?.loc?.source?.body

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
            eventId: eventID,
            page,
            perPage,
          },
        }),
      })

      // TODO: Is this the best way to handle this?
      const { data } = (await response.json()) as EventData
      console.log('data:', data)

      if (!data || !data.event) {
        throw new Error(`Event not found`)
      }
    }
  }

  // return
}

export default getEventStanding
