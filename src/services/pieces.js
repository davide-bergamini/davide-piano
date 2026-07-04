import { mozartSections } from '../data/mozart'
import { burgmullerSections } from '../data/burgmuller'
import { schumannSections } from '../data/schumann'
import { tchaikovskySections } from '../data/tchaikovsky'

const STORAGE_KEY = 'adminPieces'

const libraries = [
  {
    composer: 'Mozart',
    collection: 'Mozart',
    sections: mozartSections,
  },
  {
    composer: 'Friedrich Burgmüller',
    collection: '25 Studi op. 100',
    sections: burgmullerSections,
  },
  {
  composer: 'Robert Schumann',
  collection: 'Schumann',
  sections: schumannSections,
},{
    composer: 'Pëtr Il’ič Čajkovskij',
    collection: 'Album per la gioventù Op. 39',
    sections: tchaikovskySections,
  },
]

function normalizePiece(piece) {
  return {
    ...piece,

    id: piece.id || crypto.randomUUID(),

    title: piece.title || '',
    subtitle: piece.subtitle || '',

    composer: piece.composer || '',
    collection: piece.collection || '',
    sectionTitle: piece.sectionTitle || piece.section || '',

    number: piece.number || '',
    order: piece.order || piece.number || 0,

    key: piece.key || '',
    difficulty: piece.difficulty || '',

    startedAt: piece.startedAt || '',
    publishedAt: piece.publishedAt || '',

    status: piece.status || (piece.publishedAt ? 'published' : 'planned'),

    duration: piece.duration || '',

    description: piece.description || '',
    notes: piece.notes || '',

    midi: {
      full: piece.midi?.full || '',
      right: piece.midi?.right || '',
      left: piece.midi?.left || '',
    },

    mp3: piece.mp3 || '',
    pdf: piece.pdf || '',
    musicxml: piece.musicxml || '',
    image: piece.image || '',

    tags: Array.isArray(piece.tags) ? piece.tags : [],

    published: Boolean(piece.published || piece.publishedAt || piece.status === 'published'),
  }
}

function sectionsToPieces(sections, defaults = {}) {
  return sections.flatMap((section) =>
    section.pieces.map((piece, index) =>
      normalizePiece({
        ...defaults,
        ...piece,
        sectionTitle: piece.sectionTitle || piece.section || section.title || '',
        collection: piece.collection || defaults.collection || section.collection || section.title || '',
        composer: piece.composer || defaults.composer || section.composer || '',
        order: piece.order || piece.number || index + 1,
      }),
    ),
  )
}

function getStaticPieces() {
  return libraries.flatMap((library) =>
    sectionsToPieces(library.sections, {
      composer: library.composer,
      collection: library.collection,
    }),
  )
}

function loadPieces() {
  const savedPieces = localStorage.getItem(STORAGE_KEY)

  if (savedPieces) {
    return JSON.parse(savedPieces).map(normalizePiece)
  }

  const initialPieces = getStaticPieces()
  savePieces(initialPieces)

  return initialPieces
}

function savePieces(pieces) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pieces.map(normalizePiece)))
}

function resetPieces() {
  const initialPieces = getStaticPieces()
  savePieces(initialPieces)

  return initialPieces
}

function createEmptyPiece(order = 1) {
  return normalizePiece({
    id: crypto.randomUUID(),
    title: '',
    subtitle: '',
    composer: '',
    collection: '',
    sectionTitle: '',
    number: '',
    order,
    key: '',
    difficulty: '',
    startedAt: '',
    publishedAt: '',
    status: 'planned',
    duration: '',
    description: '',
    notes: '',
    midi: {
      full: '',
      right: '',
      left: '',
    },
    mp3: '',
    pdf: '',
    musicxml: '',
    image: '',
    tags: [],
    published: false,
  })
}

export {
  STORAGE_KEY,
  normalizePiece,
  sectionsToPieces,
  getStaticPieces,
  loadPieces,
  savePieces,
  resetPieces,
  createEmptyPiece,
}
