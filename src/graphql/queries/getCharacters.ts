import { gql } from 'graphql-tag'

export default gql`
  query CharacterQuery {
    videogame(id: 1386, slug: "game/ultimate") {
      # SSBU
      characters {
        id
        name
      }
    }
  }
`
