import * as queryString from 'graphql/queries/getEventStanding'
import dotenv from 'dotenv'
import { EventData, GetEventStandingReturnType } from 'types'
dotenv.config()
// This is ugly and I hate it, see: https://github.com/node-fetch/node-fetch/blob/HEAD/docs/v3-UPGRADE-GUIDE.md
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { STARTGG_KEY, STARTGG_URI } = process.env

const getEventStanding = async (
  eventId: number,
  page: number = 1,
  perPage: number = 8
): Promise<GetEventStandingReturnType> => {
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

      // TODO: Is this the best way to handle this?
      const { data } = (await response.json()) as EventData

      if (!data || !data.event) {
        throw new Error(`Event not found`)
      } else if (data) {
        return { data }
      }
    }
  }
}

export default getEventStanding
