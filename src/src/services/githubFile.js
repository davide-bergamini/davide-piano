const owner = 'davide-bergamini'
const repo = 'davide-piano'
const branch = 'main'

function encodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)))
}

function decodeBase64(base64) {
  return decodeURIComponent(escape(atob(base64)))
}

export async function readGithubJson(path) {
  const token = localStorage.getItem('github_token')

  if (!token) {
    throw new Error('Token GitHub mancante.')
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    },
  )

  if (response.status === 404) {
    return {
      data: [],
      sha: null,
    }
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Errore durante la lettura da GitHub.')
  }

  const file = await response.json()

  return {
    data: JSON.parse(decodeBase64(file.content)),
    sha: file.sha,
  }
}

export async function writeGithubJson(path, data, sha = null) {
  const token = localStorage.getItem('github_token')

  if (!token) {
    throw new Error('Token GitHub mancante.')
  }

  const content = JSON.stringify(data, null, 2)

  const body = {
    message: `Aggiorna ${path}`,
    content: encodeBase64(content),
    branch,
  }

  if (sha) {
    body.sha = sha
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Errore durante il salvataggio su GitHub.')
  }

  return await response.json()
}
