import { gql } from 'graphql-tag'

export default gql`
  query EventStandings($eventId: ID!, $page: Int = 1, $perPage: Int = 3) {
    event(id: $eventId) {
      id
      name
      standings(query: { perPage: $perPage, page: $page }) {
        nodes {
          placement
          entrant {
            id
            name
          }
        }
      }
    }
  }
`
