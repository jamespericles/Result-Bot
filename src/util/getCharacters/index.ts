import * as queryString from 'graphql/queries/getCharacters'
import dotenv from 'dotenv'
dotenv.config()
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { STARTGG_KEY, STARTGG_URI } = process.env

type CharacterData = {
  data: {
    videogame: {
      name: string
      characters: {
        id: number
        name: string
      }[]
    }
  }
}

export type Characters = Extract<
  CharacterData,
  { data: { videogame: { characters: { id: number; name: string }[] } } }
>['data']['videogame']['characters']

const getCharacters = async (): Promise<Characters | undefined> => {
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
        }),
      })

      const json = await response.json()
      const {
        data: {
          videogame: { characters },
        },
      } = json as CharacterData

      return characters
    }
  }
}

export default getCharacters
