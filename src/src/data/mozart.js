const BASE_URL = import.meta.env.BASE_URL

export const mozartSections = [
  {
    id: 'mozart-k545',
    title: 'Sonata facile K545',
    composer: 'Wolfgang Amadeus Mozart',
    image: `${BASE_URL}img/composers/mozart.webp`,
    pieces: [
      {
        id: 'mozart-k545-1',
        title: 'K545 — I movimento',
        subtitle: 'Allegro',
        publishedAt: '2026-05-21',
        description:
          'Composto nel 1788, il primo movimento della Sonata K545 è uno dei brani più conosciuti di Mozart. La sua apparente semplicità nasconde un perfetto equilibrio tra eleganza, chiarezza e naturalezza. La melodia si sviluppa con estrema fluidità e ogni frase sembra nascere spontaneamente dalla precedente. È una pagina che rappresenta perfettamente lo stile classico, nel quale bellezza e semplicità convivono in assoluta armonia.',
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Mozart_K545_1mvt.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Mozart_K545_1mvt.mp3`,
      },
      {
        id: 'mozart-k545-2',
        title: 'K545 — II movimento',
        subtitle: 'Andante',
        publishedAt: '2026-03-22',
        description:
          'L’Andante costituisce il momento più intimo della sonata. Dopo la vivacità del primo movimento, Mozart crea un’atmosfera raccolta e serena, nella quale la melodia procede con grande naturalezza. La musica invita all’ascolto e alla riflessione, senza mai perdere quella limpidezza che caratterizza tutto il linguaggio mozartiano. Ogni frase sembra parlare con semplicità, ma racchiude una profonda eleganza espressiva.',
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
        description:
          'Il Rondò conclude la sonata con un carattere brillante e gioioso. Il tema principale ritorna più volte, ogni volta con la stessa freschezza, intervallato da episodi che mantengono vivo l’interesse dell’ascoltatore. La musica trasmette leggerezza e spontaneità, lasciando l’impressione di un dialogo vivace che si conclude con naturalezza e ottimismo.',
        publishedAt: '',
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
