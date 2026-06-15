const BASE_URL = import.meta.env.BASE_URL

export const mozartSections = [
  {
    id: 'mozart-k545',
    title: 'Sonata facile K545',
    pieces: [
      {
        id: 'mozart-k545-1',
        title: 'K545 — I movimento',
        subtitle: 'Allegro',
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/k545_1_clean.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Mozart_K545_1st_movimento.mp3`,
      },
      {
        id: 'mozart-k545-2',
        title: 'K545 — II movimento',
        subtitle: 'Andante',
        duration: '5:11',
        midi: {
          full: `${BASE_URL}midi/Mozart_K545_2nd_movimento.mid`,
          right: '',
          left: '',
        },
      },
      {
        id: 'mozart-k545-3',
        title: 'K545 — III movimento',
        subtitle: 'Rondo',
        duration: '—',
        midi: {
          full: '',
          right: '',
          left: '',
        },
      },
    ],
  },
]
