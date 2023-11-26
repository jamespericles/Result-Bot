type CharacterMap = {
    [key: string]: string
  }
  
  // Top8er API has some mismatched character names with smash.gg
const sanitizedCharacterName = (characterName: string): string => {
    const characterMap: CharacterMap = {
      'Banjo-Kazooie': 'Banjo & Kazooie',
      'Bowser Jr.': 'Bowser Jr',
      'Dr. Mario': 'Dr Mario',
      'R.O.B.': 'ROB',
      'King K. Rool': 'King K Rool',
      'Simon Belmont': 'Simon',
      'Mr. Game & Watch': 'Mr Game & Watch',
      'Pyra & Mythra': 'Pyra and Mythra',
      'Random Character': 'Random',
      // Easily extendable
    }
  
    return characterMap[characterName] || characterName
  }

export default sanitizedCharacterName