import * as queryString from 'graphql/queries/getEventID'
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
    }
  }
}

const getEventID = async (eventSlug: string): Promise<number> => {
  let eventID: number = 0

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
            slug: eventSlug,
          },
        }),
      })

      // TODO: Is this the best way to handle this?
      const { data } = (await response.json()) as EventData

      if (!data || !data.event) {
        throw new Error(`Event with slug ${eventSlug} not found`)
      }

      eventID = data.event.id
    }
  }

  return eventID
}

export default getEventID
