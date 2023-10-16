import { EmbedBuilder } from "@discordjs/builders";
import { generateResultsPayload } from "util/index";
import { Standings } from "util/getEventStanding";

describe("generateResultsPayload", () => {
  it("should generate an EmbedBuilder with the correct title and URL", () => {
    const week = "1"
    const slug = "example-event"
    const eventStanding: Standings = []

    const embed = generateResultsPayload(week, slug, eventStanding)

    expect(embed).toBeInstanceOf(EmbedBuilder)
    expect(embed.data.color).toBe(15728384)
    expect(embed.data.title).toBe('Week 1 | Ultimate Singles Top 8')
    expect(embed.data.url).toBe('https://start.gg/example-event')
  })

  it('should return an EmbedBuilder object with no fields if eventStanding is empty', () => {
    const week = '1';
    const slug = 'test-event';
    const eventStanding: Standings = Array.from({ length: 8 }, (_, i) => ({
      placement: i + 1,
      entrant: {
        id: i + 1,
        name: `Player ${i + 1}`,
      },
    }))

    const embed = generateResultsPayload(week, slug, eventStanding);

    expect(embed.data.fields).toHaveLength(8)
    embed.data.fields?.forEach((field, i) => {
        expect(field.name).toBe(' ')
        expect(field.value).toBe(`#${i + 1}: [Player ${i + 1}](https://start.gg/user/${i + 1})`)
        })
    })
})