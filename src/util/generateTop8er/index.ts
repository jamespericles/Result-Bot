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

interface GenerateImageResult {
  success: true
  image: Base64String
}

interface GenerateImageError {
  success: false
  error: Error
}

type GenerateImageResponse = GenerateImageResult | GenerateImageError

const generateTop8er = async (
  eventStanding: Standings,
  selectionSample: Selections[]
): Promise<GenerateImageResponse | undefined> => {
  const characterArray = (await getCharacters()) as Characters
  if (eventStanding && selectionSample && characterArray) {
    const merged = eventStanding.map((standing) => {
      const selection = selectionSample.find(
        (s) => s.id === standing.entrant.id
      )

      const character = characterArray.find(
        (c) => c.id === selection?.selectionValue
      )

      return {
        name: standing.entrant.name,
        social: '',
        character: [[character?.name ?? 'Random', 0], null, null],
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
        // @TODO - Make this dynamic, double check with Riokaru this actually works
        options: {
          toptext: 'Smash League Top Network - 1vs1 Super Smash Ultimate',
          url: 'https://www.start.gg/tournament/smash-league-top-network',
          bottomtext: '2023/07/29 - San Diego - 45 Participantes',
          layoutcolor: '#df2c3b',
          fontcolor: '#ffffff',
          fontcolor2: '#ffffff',
          fontshadowcolor: '#000000',
          fontshadowcolor2: '#000000',
          mainfont: null,
          blacksquares: true,
          charshadow: true,
          textshadow: true,
          darkenbg: false,
          layout: true,
        },
      }),
    })

    // TODO: Can I pass in the status code like this?
    if (res.status !== 200)
      return { success: false, error: new Error(`Error: ${res.status}`) }

    if (res.status === 200) {
      const { base64_img } = (await res.json()) as { base64_img: string }

      // Assuming you have the base64 image data in a variable called `base64Img`
      const base64Img = base64_img

      // Remove the data URI prefix from the base64 string
      const base64Data = base64Img.replace(/^data:image\/\w+;base64,/, '')

      // Create a buffer from the base64 data
      const buffer = Buffer.from(base64Data, 'base64')

      // Write the buffer to a file
      fs.writeFile('top8er.png', buffer, (err) => {
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
