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
      if (json.data.event) {
        const {
          data: {
            event: {
              sets: { nodes },
            },
          },
        } = json as SelectionValueData
        
        let result: Selections[] = []
      
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (node.games) {
            for (let j = 0; j < node.games.length; j++) {
              let game = node.games[j]

              // If game.selections is null, replace it with an empty array
              game.selections = game.selections || []
              if (game.selections.length) {
                for (let k = 0; k < game.selections.length; k++) {
                  let selection = game.selections[k]
                  let obj: Selections = {
                    selectionValue: null,
                    id: null,
                    name: null,
                  }
      
                  obj.selectionValue = selection.selectionValue
                  for (let l = 0; l < selection.entrant.participants.length; l++) {
                    let participant = selection.entrant.participants[l]
                    obj.id = participant.entrants[0].id
                    obj.name = participant.entrants[0].name
      
                    result.push(obj);
                  }
                }
              }
            }
          }
        }

        return result
      }
        
      } else {
        console.error('No event found, selection sample not generated')
        return 
      }
    }
  }


export default getSelectionValByGame
