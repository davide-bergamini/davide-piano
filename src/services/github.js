const GITHUB_OWNER = 'davide-bergamini'
const GITHUB_REPO = 'davide-piano'
const GITHUB_BRANCH = 'main'

function getGithubToken() {
  return localStorage.getItem('github_token')
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      const base64 = result.split(',')[1]
      resolve(base64)
    }

    reader.onerror = () => reject(new Error('Errore nella lettura del file.'))

    reader.readAsDataURL(file)
  })
}

export async function uploadFileToGithub(file, folder) {
  const token = getGithubToken()

  if (!token) {
    throw new Error('Token GitHub mancante. Inseriscilo nella sezione GitHub Token.')
  }

  const safeFileName = file.name.replaceAll(' ', '_')
  const path = `public/${folder}/${safeFileName}`
  const content = await fileToBase64(file)

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: `Upload ${folder}: ${safeFileName}`,
      content,
      branch: GITHUB_BRANCH,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Errore durante upload su GitHub.')
  }

  return {
    path,
    fileName: safeFileName,
    githubUrl: data.content?.html_url,
    downloadUrl: data.content?.download_url,
  }
}
