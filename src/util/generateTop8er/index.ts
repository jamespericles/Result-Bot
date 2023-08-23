import fs from 'fs'
import dotenv from 'dotenv'
import { Base64String } from 'discord.js'
import { getCharacters } from 'util/index'
import { Selections } from 'util/getSelectionValByGame'
import { Characters } from 'util/getCharacters'
import { Standings } from 'util/getEventStanding'
dotenv.config()
// @ts-ignore
const fetch = (...args) =>
  // @ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { TOP8ER_URI } = process.env

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
    const mostFrequentSelections = new Map<number, number | null>()

    const merged = eventStanding.map((standing) => {
      const playerId = standing.entrant.id
      const selectionsForPlayer = selectionSample.filter(
        (s) => s.id === playerId
      )

      let mostFrequentSelection: number | null = null
      let maxCount = 0
      const selectionCountMap = new Map<number, number>()

      selectionsForPlayer.forEach((selection) => {
        const selectionValue = selection.selectionValue
        if (selectionValue !== null) {
          const currentCount = selectionCountMap.get(selectionValue) || 0
          const newCount = currentCount + 1
          selectionCountMap.set(selectionValue, newCount)

          if (newCount > maxCount) {
            maxCount = newCount
            mostFrequentSelection = selectionValue
          }
        }
      })

      mostFrequentSelections.set(playerId, mostFrequentSelection)

      const character = characterArray.find(
        (c) => c.id === mostFrequentSelection
      )

      // Top8er API has Simon Belmont as Simon
      const characterName = character?.name ?? 'Random'
      const sanitizedCharacterName =
        characterName === 'Simon Belmont' ? 'Simon' : characterName

      return {
        name: standing.entrant.name,
        social: '',
        character: [[sanitizedCharacterName, 0], null, null],
        flag: [null, null],
      }
    })

    const res = await fetch(TOP8ER_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        players: merged,
        options: {
          blacksquares: true,
          charshadow: true,
          textshadow: true,
          darkenbg: true,
          topleft: `Alulu-${week}`,
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

    if (res.status !== 200)
      return {
        success: false,
        error: new Error(`Error: ${res.status}`),
      }

    if (res.status === 200) {
      const { base64_img } = (await res.json()) as { base64_img: string }

      // Assuming you have the base64 image data in a variable called `base64Img`
      const base64Img = base64_img

      // Remove the data URI prefix from the base64 string
      const base64Data = base64Img.replace(/^data:image\/\w+;base64,/, '')

      // Create a buffer from the base64 data
      const buffer = Buffer.from(base64Data, 'base64')

      // Write the buffer to a file
      fs.writeFile('graphic.png', buffer, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('Image saved successfully')
        }
      })
      return { success: true, image: base64Data }
    }
  }
}

export default generateTop8er
