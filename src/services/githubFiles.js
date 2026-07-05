const GITHUB_OWNER = 'davide-bergamini'
const GITHUB_REPO = 'davide-piano'
const GITHUB_BRANCH = 'main'

const FILE_FOLDERS = {
  midi: ['public/midi'],
  mp3: ['public/mp3'],
  pdf: ['public/pdf', 'public/scores'],
  musicxml: ['public/musicxml', 'public/xml'],
}

const FILE_EXTENSIONS = {
  midi: ['mid', 'midi'],
  mp3: ['mp3'],
  pdf: ['pdf'],
  musicxml: ['musicxml', 'xml', 'mxl'],
}

function getExtension(filename) {
  return filename.split('.').pop()?.toLowerCase() || ''
}

function toPublicPath(folder, filename) {
  const publicFolder = folder.replace(/^public\/?/, '')
  return `${import.meta.env.BASE_URL}${publicFolder}/${filename}`
}

async function fetchGithubFolder(folder) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folder}?ref=${GITHUB_BRANCH}`

  const response = await fetch(url)

  if (!response.ok) {
    return []
  }

  const items = await response.json()

  return items
    .filter((item) => item.type === 'file')
    .map((item) => ({
      name: item.name,
      githubPath: item.path,
      downloadUrl: item.download_url,
      publicPath: toPublicPath(folder, item.name),
      extension: getExtension(item.name),
    }))
}

export async function fetchFilesByType(type) {
  const folders = FILE_FOLDERS[type] || []
  const allowedExtensions = FILE_EXTENSIONS[type] || []

  const results = await Promise.all(folders.map((folder) => fetchGithubFolder(folder)))

  return results
    .flat()
    .filter((file) => allowedExtensions.includes(file.extension))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchAllUploadFiles() {
  const [midi, mp3, pdf, musicxml] = await Promise.all([
    fetchFilesByType('midi'),
    fetchFilesByType('mp3'),
    fetchFilesByType('pdf'),
    fetchFilesByType('musicxml'),
  ])

  return {
    midi,
    mp3,
    pdf,
    musicxml,
  }
}
