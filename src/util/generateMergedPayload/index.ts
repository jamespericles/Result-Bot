import { sanitizedCharacterName } from 'util/index'
import { Characters } from 'util/getCharacters'
import { Standings } from 'util/getEventStanding'
import { Selections } from 'util/getSelectionValByGame'

type Payload = {
  name: string
  social: string
  character: ((string | number)[] | null)[]
  flag: null[]
}[]

export const determineCharacterName = (character: { id: number; name: string } | undefined): string => {
    return character?.name ?? 'Random'
}

const generateMergedPayload = (
  eventStanding: Standings,
  selectionSample: Selections[],
  characterArray: Characters
): Payload => {
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

    const characterName = determineCharacterName(character)

    return {
      name: standing.entrant.name,
      social: "",
      character: [[sanitizedCharacterName(characterName), 0], null, null],
      flag: [null, null],
    }
  })

  return merged
}

export default generateMergedPayload
