"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
exports.default = (0, graphql_tag_1.gql) `
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
`;
