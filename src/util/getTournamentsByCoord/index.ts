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
  slug: string | null
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
    slug: null,
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
        console.log("file: index.ts:80 ~ data.tournaments.nodes:", data.tournaments.nodes)
        
        for (const node of data.tournaments.nodes) {
          if (node.name.includes(sanitizeTournamentName(process.env.TOURNAMENT_NAME as string)) && node.name.includes(`#${week}`)) {
            const slugs = [
              `tournament/${sanitizeSlug(node.name)}/event/ultimate-singles`,
              `tournament/${sanitizeSlug(node.name)}-1/event/ultimate-singles`, 
              `tournament/${sanitizeSlug(node.name)}-2/event/ultimate-singles`,
            ]

            for (let i = 0; i < slugs.length; i++) {
              let response = await getEventID(slugs[i])

              if (response !== undefined) {
                res.id = response
                res.slug = slugs[i]
                break
              }              
            }
            
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
