import { STORAGE_KEY } from './works'

const owner = 'davide-bergamini'
const repo = 'davide-piano'
const branch = 'main'
const path = 'src/data/repertoire.json'

function getGithubToken() {
  return localStorage.getItem('github_token')
}

function toBase64(text) {
  return btoa(unescape(encodeURIComponent(text)))
}

async function getExistingFileSha(token) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    },
  )

  if (response.status === 404) return null

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  const data = await response.json()
  return data.sha
}

export async function publishRepertoire() {
  const token = getGithubToken()

  if (!token) {
    throw new Error('Token GitHub mancante.')
  }

  const savedWorks = localStorage.getItem(STORAGE_KEY)

  if (!savedWorks) {
    throw new Error('Nessun repertorio trovato nel browser.')
  }

  const json = JSON.stringify(JSON.parse(savedWorks), null, 2)
  const content = toBase64(`${json}\n`)
  const sha = await getExistingFileSha(token)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: 'Update repertoire data',
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}
