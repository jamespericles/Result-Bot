import fs from 'fs'
import dotenv from 'dotenv'
import { Base64String } from 'discord.js'
import { getCharacters, 
  sanitizeTournamentName, 
  generateMergedPayload 
} from 'util/index'
import { Selections } from 'util/getSelectionValByGame'
import { Characters } from 'util/getCharacters'
import { Standings } from 'util/getEventStanding'
dotenv.config()
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { TOP8ER_URI, TOURNAMENT_NAME } = process.env

type GenerateImageResponse =
  | {
      success: true
      image: Base64String
    }
  | {
      success: false
      error: Error
      image?: never
    }

const generateTop8er = async (
  eventStanding: Standings,
  selectionSample: Selections[],
  week: string | number
): Promise<GenerateImageResponse | undefined> => {
  const characterArray = (await getCharacters()) as Characters

  if (eventStanding && selectionSample && characterArray) {
    const res = await fetch(TOP8ER_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        players: generateMergedPayload(
          eventStanding,
          selectionSample,
          characterArray
        ),
        options: {
          blacksquares: true,
          charshadow: true,
          textshadow: true,
          darkenbg: true,
          topleft: `${sanitizeTournamentName(TOURNAMENT_NAME as string)}-${week}`,
          topright: 'Ultimate Singles',
          bottomleft: '',
          numbers: 'default', // default | prmode | cleanmode = no numbers
          layoutcolor: '#df2c3b', // boxes around characters, top left bottom right corners
          layoutcolor2: '#ffb60c', // smaller swoosh in top left and bottom right
          fontcolor: '#ffffff', // placement number, player name
          fontcolor2: '#ffffff', // top text, bottom text
          fontshadowcolor: '#000000', // placement number, player name (shadows)
          fontshadowcolor2: '#000000', // top text, bottom text (shadows)
          // font: 'Arial',
        },
      }),
    })

    if (res.status !== 200) {
      return {
        success: false,
        error: new Error(`Error: ${res.status}`),
      }
    }

    if (res.status === 200) {
      const { base64_img } = (await res.json()) as { base64_img: string }

      const base64Img = base64_img

      // Remove the data URI prefix from the base64 string
      const base64Data = base64Img.replace(/^data:image\/\w+;base64,/, '')

      // Create a buffer from the base64 data
      const buffer = Buffer.from(base64Data, 'base64')

      // Write the buffer to a file
      await fs.promises.writeFile('graphic.png', buffer)
      return { success: true, image: base64Data }
    }
  }
}

export default generateTop8er
