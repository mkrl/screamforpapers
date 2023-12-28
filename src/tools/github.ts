import type { PersonalInfo, Talk } from '../storage'

type RepoFile = {
  download_url: string
  name: string
}
type RepoCommit = {
  sha: string
}

export const get = async ({ url, token }: { url: string; token: string }) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  return await response.json()
}

export const download = async (url: string) => {
  const response = await fetch(url)
  return await response.text()
}

export const extractKeyValuePairs = (markdown: string) => {
  const regex = /# ([^\n]+)\n([\s\S]*?)(?=(#\s*[^\n]+|$))/g
  const matches = markdown.matchAll(regex)

  return [...matches].reduce((result, match) => {
    const key = match[1].trim()
    // @ts-ignore
    result[key] = match[2].trim()
    return result
  }, {})
}

export const syncWithGithub = async ({
  token,
  repo,
  logFn = console.log,
}: {
  token: string
  repo: string
  logFn?: (log: string) => void
}) => {
  if (token && repo) {
    const owner = repo.split('/').at(-2)
    const repository = repo.split('/').at(-1)

    try {
      logFn('Fetching list of files')
      const repoData = (await get({
        url: `https://api.github.com/repos/${owner}/${repository}/contents`,
        token,
      })) as RepoFile[]

      logFn('Fetching commit data')
      const commitData = (await get({
        url: `https://api.github.com/repos/${owner}/${repository}/commits`,
        token,
      })) as RepoCommit[]
      const latestCommit = commitData[0].sha

      const talkList: Talk[] = []
      let personalInfo: PersonalInfo | null = null

      for (const file of repoData) {
        if (file.name.endsWith('.md')) {
          try {
            logFn(`Downloading ${file.name}`)
            const contents = await download(file.download_url)
            if (file.name === 'README.md') {
              personalInfo = extractKeyValuePairs(contents)
            } else {
              const keyValuePairs = extractKeyValuePairs(contents)
              talkList.push(<Talk>{
                ...keyValuePairs,
                __revision: {
                  sha: latestCommit,
                  link: `${repo}/blob/${latestCommit}/${file.name}`,
                },
                id: file.name.split('.').at(0),
              })
            }
          } catch (e) {
            logFn(
              `Error while fetching ${file.name}, perhaps it's worth retrying later`
            )
            throw e
          }
        }
      }
      if (talkList.length === 0) {
        alert('No talks found in repo.')
      }
      if (!personalInfo) {
        alert(
          'No personal info found in repo, be sure to add a README.md file.'
        )
      }
      logFn(`All done!`)
      return { personalInfo, talkList }
    } catch (e) {
      logFn(
        `Error while fetching the repository, is your token valid and has read access?`
      )
      throw e
    }
  } else {
    alert('Please set your token and repo before syncing.')
  }
}
