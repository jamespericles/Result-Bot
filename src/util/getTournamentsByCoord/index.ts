import * as queryString from 'graphql/queries/getTournamentsByCoord'
import dotenv from 'dotenv'
import { getEventID, sanitizeTournamentName } from 'util/index'
dotenv.config()
// @ts-ignore
const fetch = (...args) =>
  //@ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { STARTGG_KEY, STARTGG_URI } = process.env

type TournamentData = {
  data: {
    tournaments: {
      nodes: {
        id: number
        name: string
        city: string
      }[]
    }
  }
  actionRecords: unknown[]
}

type ReturnType = {
  id: number | null
  name: string | null
}

export const sanitizeSlug = (input: string): string => {
  // Remove special characters except hyphens
  const withoutSpecialChars = input.replace(/[^a-zA-Z0-9-]/g, ' ')

  // Replace spaces with hyphens
  const withHyphens = withoutSpecialChars.replace(/\s+/g, '-')

  // Convert to lowercase
  const lowercase = withHyphens.toLowerCase()

  return lowercase
}

const getTournamentsByCoord = async (
  page = 1,
  coordinates: string,
  radius: string,
  week: string | number
): Promise<ReturnType> => {
  let res: ReturnType = {
    id: null,
    name: null,
  }

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
            page,
            coordinates,
            radius,
          },
        }),
      })

      const { data } = (await response.json()) as TournamentData

      if (data.tournaments.nodes) {
        for (const node of data.tournaments.nodes) {
          if (node.name.includes(sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)) && node.name.includes(`#${week}`)) {
            let id = await getEventID(
              `tournament/${sanitizeSlug(node.name)}/event/ultimate-singles`
            )
            res.id = id
            res.name = sanitizeSlug(node.name)

            break
          }
        }
      }
    }
  }

  return res
}

export default getTournamentsByCoord
