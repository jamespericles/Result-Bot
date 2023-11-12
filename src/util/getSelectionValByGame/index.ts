import * as queryString from 'graphql/queries/getSelectionValByGame'
import dotenv from 'dotenv'
dotenv.config()
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

type SelectionValueData = {
  data: {
    event: {
      sets: {
        nodes: {
          games: {
            selections: {
              selectionValue: number
              entrant: {
                participants: {
                  entrants: {
                    id: number
                    name: string
                  }[]
                }[]
              }
            }[]
          }[]
        }[]
      }
    }
  }
}

export type Selections = {
  selectionValue: number | null
  id: number | null
  name: string | null
}

const { STARTGG_KEY, STARTGG_URI } = process.env

const getSelectionValByGame = async (
  eventSlug: string
): Promise<Selections[] | Error | undefined> => {
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

      const json = await response.json() as { data: { event: unknown } }

      if (response.status === 200 && json.data.event) {
        const {
          data: {
            event: {
              sets: { nodes },
            },
          },
        } = json as SelectionValueData
        
        let result: Selections[] = []

        nodes.forEach((node) => {
          if (node.games) {
            node.games.forEach((game) => {
              if (game.selections.length) {
                game.selections.forEach((selection) => {
                  let obj: Selections = {
                    selectionValue: null,
                    id: null,
                    name: null,
                  }
                  
                  obj.selectionValue = selection.selectionValue
                  selection.entrant.participants.forEach((participant) => {
                    obj.id = participant.entrants[0].id
                    obj.name = participant.entrants[0].name
                    
                    result.push(obj)
                  })
                })
              }
            })
          }
        })
        
        console.log("file: index.ts:100 ~ result:", result)
      return result
      } else {
        console.error('No event found, selection sample not generated')
        return 
      }
    }
  }
}

export default getSelectionValByGame
