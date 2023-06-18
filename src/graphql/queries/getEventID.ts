import { gql } from 'graphql-tag'

export default gql`
  query getEventID($slug: String!) {
    event(slug: $slug) {
      id
      name
    }
  }
`
