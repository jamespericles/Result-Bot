// @ts-ignore
const fetch = (...args) =>
  //@ts-ignore
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const getNumberFromRedirect = async (url: string): Promise<number | void> => {
  const response = await fetch(url, { redirect: 'follow' })

  if (response.ok) {
    const match = response.url.match(/\/tournament\/[^-]*-([0-9]+)/)

    return match ? parseInt(match[1]) : undefined
  } else {
    console.error(response.statusText)
  }
}

export default getNumberFromRedirect