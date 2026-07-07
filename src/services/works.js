import { mozartSections } from '../data/mozart'
import { burgmullerSections } from '../data/burgmuller'
import { schumannSections } from '../data/schumann'
import { tchaikovskySections } from '../data/tchaikovsky'

import { normalizePiece, createEmptyPiece } from './pieces'

const STORAGE_KEY = 'adminWorks'

const libraries = [
  {
    id: 'mozart',
    name: 'Mozart',
    composer: 'Wolfgang Amadeus Mozart',
    collection: 'Mozart',
    sections: mozartSections,
  },
  {
    id: 'burgmuller',
    name: 'Burgmüller',
    composer: 'Friedrich Burgmüller',
    collection: '25 Studi op. 100',
    sections: burgmullerSections,
  },
  {
    id: 'schumann',
    name: 'Schumann',
    composer: 'Robert Schumann',
    collection: 'Schumann',
    sections: schumannSections,
  },
  {
    id: 'tchaikovsky',
    name: 'Čajkovskij',
    composer: 'Pëtr Il’ič Čajkovskij',
    collection: 'Album per la gioventù Op. 39',
    sections: tchaikovskySections,
  },
]

function createSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replaceAll('à', 'a')
    .replaceAll('è', 'e')
    .replaceAll('é', 'e')
    .replaceAll('ì', 'i')
    .replaceAll('ò', 'o')
    .replaceAll('ù', 'u')
    .replaceAll('č', 'c')
    .replaceAll('ë', 'e')
    .replaceAll('’', '')
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createWorkId(work) {
  const composer = createSlug(work.composer)
  const title = createSlug(work.title || work.collection)

  return `${composer}-${title}`
}

function normalizeWork(work) {
  return {
    id: work.id || createWorkId(work) || crypto.randomUUID(),

    title: work.title || '',
    composer: work.composer || '',
    collection: work.collection || '',
    image: work.image || '',

    year: work.year || '',
    description: work.description || '',
    notes: work.notes || '',

    order: work.order || 0,

    pieces: Array.isArray(work.pieces)
      ? work.pieces.map((piece, index) =>
          normalizePiece({
            ...piece,
            composer: piece.composer || work.composer || '',
            collection: piece.collection || work.collection || work.title || '',
            sectionTitle: piece.sectionTitle || work.title || '',
            order: piece.order || piece.number || index + 1,
          }),
        )
      : [],
  }
}

function ensureUniqueWorkIds(works) {
  const usedIds = new Set()

  return works.map((work) => {
    let normalizedWork = normalizeWork(work)
    let id = normalizedWork.id

    if (!id || usedIds.has(id)) {
      id = createWorkId(normalizedWork) || crypto.randomUUID()
    }

    let finalId = id
    let counter = 2

    while (usedIds.has(finalId)) {
      finalId = `${id}-${counter}`
      counter += 1
    }

    usedIds.add(finalId)

    return {
      ...normalizedWork,
      id: finalId,
    }
  })
}

function sectionsToWorks(sections, defaults = {}) {
  return sections.map((section, index) =>
    normalizeWork({
      id: section.id
        ? `${defaults.libraryId}-${section.id}`
        : `${defaults.libraryId}-${createSlug(section.title)}`,

      title: section.title || '',
      composer: section.composer || defaults.composer || '',
      collection: section.collection || defaults.collection || section.title || '',
      image: section.image || '',
      year: section.year || '',
      description: section.description || '',
      notes: section.notes || '',
      order: section.order || index + 1,
      pieces: section.pieces || [],
    }),
  )
}

function getStaticWorks() {
  return libraries.flatMap((library) =>
    sectionsToWorks(library.sections, {
      libraryId: library.id,
      composer: library.composer,
      collection: library.collection,
    }),
  )
}

function loadWorks() {
  const savedWorks = localStorage.getItem(STORAGE_KEY)

  if (savedWorks) {
    const parsedWorks = JSON.parse(savedWorks)
    const fixedWorks = ensureUniqueWorkIds(parsedWorks)

    saveWorks(fixedWorks)

    return fixedWorks
  }

  const initialWorks = ensureUniqueWorkIds(getStaticWorks())

  saveWorks(initialWorks)

  return initialWorks
}

function saveWorks(works) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureUniqueWorkIds(works)))
}

function resetWorks() {
  const initialWorks = ensureUniqueWorkIds(getStaticWorks())

  saveWorks(initialWorks)

  return initialWorks
}

function createEmptyWork(order = 1) {
  return normalizeWork({
    id: crypto.randomUUID(),
    title: '',
    composer: '',
    collection: '',
    image: '',
    year: '',
    description: '',
    notes: '',
    order,
    pieces: [],
  })
}

function addPieceToWork(work) {
  return normalizeWork({
    ...work,
    pieces: [
      ...work.pieces,
      createEmptyPiece(work.pieces.length + 1),
    ],
  })
}

export {
  STORAGE_KEY,
  normalizeWork,
  sectionsToWorks,
  getStaticWorks,
  loadWorks,
  saveWorks,
  resetWorks,
  createEmptyWork,
  addPieceToWork,
}
