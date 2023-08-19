import { gql } from 'graphql-tag'

export default gql`
  query SelectionValue($slug: String!, $perPage: Int = 18, $page: Int = 1) {
    event(slug: $slug) {
      sets(page: $page, perPage: $perPage, sortType: RECENT) {
        nodes {
          games {
            selections {
              selectionValue
              entrant {
                participants {
                  entrants {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
