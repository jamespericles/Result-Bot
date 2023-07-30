import { gql } from 'graphql-tag'

export default gql`
  query getTournamentByCoord(
    $perPage: Int
    $coordinates: String!
    $radius: String!
  ) {
    tournaments(
      query: {
        perPage: $perPage
        filter: { location: { distanceFrom: $coordinates, distance: $radius } }
      }
    ) {
      nodes {
        id
        name
        city
      }
    }
  }
`
