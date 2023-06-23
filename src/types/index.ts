export type Entrant = {
  id: number
  name: string
}

export type StandingsNode = {
  placement: number
  entrant: Entrant
}

export type Standings = {
  nodes: StandingsNode[]
}

export type Event = {
  id: number
  name: string
  standings: Standings
}

export type EventData = {
  data?: {
    event: Event
  }
}

export type GetEventStandingReturnType = EventData | Error | undefined
