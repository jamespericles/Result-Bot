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

const getEventID = async (eventSlug: string): Promise<number | undefined> => {
  let eventID: number = 0

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
            slug: eventSlug,
          },
        }),
      })

      const json = await response.json() as { data: { event: unknown}}

      if (response.status === 200 && json.data.event) {
        const { data } = json as EventData

        eventID = data.event.id
      } else {
        console.log('Event ID not found')
        return
      }
    }
  }

  return eventID
}

export default getEventID
