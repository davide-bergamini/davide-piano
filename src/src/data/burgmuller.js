const BASE_URL = import.meta.env.BASE_URL

export const burgmullerSections = [
  {
    id: 'burgmuller-op100',
    title: '25 Studi facili e progressivi Op. 100',
    id: 'burgmuller-op100',
    title: '25 Studi facili e progressivi Op. 100',
    composer: 'Friedrich Burgmüller',
    image: `${BASE_URL}img/composers/Burgmuller.webp`,
    pieces: [
      {
        id: 'op100-1',
        title: 'Op. 100 n. 1',
        subtitle: 'Candore',
        publishedAt: '2026-06-16',
        description:
          "Candore apre la raccolta Op. 100 con una musica semplice e spontanea, pensata per introdurre gradualmente il pianista allo stile di Burgmüller. L'esecuzione deve trasmettere naturalezza e serenità, senza eccessi espressivi. È un ottimo studio per imparare a ottenere un suono pulito, un fraseggio regolare e una buona coordinazione tra le mani, ponendo solide basi per i brani successivi della raccolta.",
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Candore_01_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Candore_01_Burgmuller.mp3`,
      },
      {
        id: 'op100-2',
        title: 'Op. 100 n. 2',
        subtitle: 'Arabesco',
        publishedAt: '2026-06-14',
        description:
          "Il titolo richiama gli eleganti motivi decorativi dell'arte araba, caratterizzati da linee continue e armoniose. Anche l'esecuzione deve risultare fluida e leggera, con movimenti naturali delle dita e un ritmo sempre regolare. Questo studio aiuta a sviluppare agilità, precisione e continuità del fraseggio senza perdere la chiarezza della melodia.",
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Arabesca_02_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Arabesca_02_Burgmuller.mp3`,
      },
      {
        id: 'op100-3',
        title: 'Op. 100 n. 3',
        subtitle: 'Pastorale',
        publishedAt: '2026-06-10',
        description:
          "Pastorale evoca la tranquillità della campagna e invita il pianista a creare un'atmosfera serena e rilassata. Il brano richiede un tocco morbido e una particolare attenzione alla cantabilità della melodia. Più che la velocità, conta la capacità di far respirare ogni frase musicale con equilibrio ed espressività.",
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Pastorale_03_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Pastorale_03_Burgmuller.mp3`,
      },
      {
        id: 'op100-4',
        title: 'Op. 100 n. 4',
        subtitle: 'Piccola riunione',
        description:
          "Questo studio descrive musicalmente l'allegria di un incontro tra amici, attraverso un dialogo vivace e ricco di piccoli contrasti. L'interpretazione deve mantenere un carattere brillante e spontaneo, valorizzando le diverse frasi senza perdere continuità. È un buon esercizio per sviluppare vivacità ritmica e precisione esecutiva.",
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-5',
        title: 'Op. 100 n. 5',
        subtitle: 'Innocenza',
        publishedAt: '2026-06-12',
        description:
          'Innocenza esprime semplicità e delicatezza attraverso una scrittura chiara ed essenziale. Il pianista è chiamato a evitare qualsiasi enfasi, privilegiando un suono dolce e naturale. Lo studio favorisce il controllo delle dinamiche e insegna come ottenere espressività anche con mezzi tecnici apparentemente semplici.',
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Innocenza_05_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Innocenza_05_Burgmuller.mp3`,
      },
      {
        id: 'op100-6',
        title: 'Op. 100 n. 6',
        publishedAt: '2026-06-19',
        subtitle: 'Progresso',
        description:
          "Come suggerisce il titolo, Progresso rappresenta un passo avanti nel percorso didattico dell'Op. 100. La scrittura diventa più articolata e richiede maggiore sicurezza nella coordinazione delle mani. Lo studio aiuta a consolidare la regolarità ritmica e a sviluppare una tecnica sempre più fluida e controllata.",
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Progresso_06_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Progresso_06_Burgmuller.mp3`,
      },
      {
        id: 'op100-7',
        title: 'Op. 100 n. 7',
        subtitle: 'Ruscello limpido',
        publishedAt: '2026-06-20',
        description:
          "Le figurazioni continue ricordano lo scorrere dell'acqua di un piccolo ruscello. L'esecuzione deve trasmettere leggerezza e naturalezza, evitando accenti eccessivi che interromperebbero il flusso musicale. È un ottimo esercizio per sviluppare uniformità nel tocco e continuità del movimento.",
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Limpido_Ruscello_07_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Limpido_Ruscello_07_Burgmuller.mp3`,
      },
      {
        id: 'op100-8',
        title: 'Op. 100 n. 8',
        subtitle: 'La graziosa',
        description:
          'La graziosa è uno degli studi più eleganti dell’Op. 100 di Burgmüller. Il titolo suggerisce subito il carattere del brano: leggerezza, naturalezza e buon gusto. Non serve suonarlo con forza, ma con misura, cercando una linea melodica pulita e un accompagnamento discreto. È un piccolo studio di stile, utile per imparare a rendere espressivo anche un brano breve e apparentemente semplice.',
        publishedAt: '2026-06-21',
        duration: '—',
        midi: {
          full: `${BASE_URL}midi/Graziosa_08_Burgmuller.mid`,
          right: '',
          left: '',
        },
        mp3: `${BASE_URL}mp3/Graziosa_08_Burgmuller.mp3`,
      },
      {
        id: 'op100-9',
        title: 'Op. 100 n. 9',
        subtitle: 'La caccia',
        description:
          'Il galoppo dei cavalli, l’abbaiare dei cani e il richiamo dei corni sembrano prendere vita in questo studio dal carattere vivace. Burgmüller non descrive una vera scena di caccia, ma ne suggerisce l’entusiasmo e il continuo senso di movimento. La musica deve conservare energia e slancio, come una corsa attraverso boschi e prati.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-10',
        title: 'Op. 100 n. 10',
        subtitle: 'Fiore delicato',
        description:
          'Questo brano invita a osservare la bellezza delle cose più semplici. Come un piccolo fiore che sboccia in silenzio, la melodia cresce con naturalezza e discrezione, senza mai cercare di imporsi. L’atmosfera è intima e serena, e ogni frase dovrebbe essere eseguita con la stessa cura che si riserva a qualcosa di prezioso e fragile.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-11',
        title: 'Op. 100 n. 11',
        subtitle: 'La ballerina',
        description:
          'La musica sembra seguire i passi leggeri di una giovane ballerina che si muove con eleganza e sicurezza. Ogni frase richiama un movimento armonioso, alternando grazia e vivacità senza mai perdere equilibrio. Più che la velocità, conta la capacità di trasmettere leggerezza e naturalezza.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-12',
        title: 'Op. 100 n. 12',
        subtitle: 'Addio',
        description:
          'Addio racconta il momento delicato di una separazione, senza drammaticità ma con una vena di malinconia. La musica sembra voltarsi un’ultima volta prima di allontanarsi lentamente, lasciando un ricordo sereno. È un brano che invita ad ascoltare il silenzio tra le frasi tanto quanto le note stesse.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-13',
        title: 'Op. 100 n. 13',
        subtitle: 'Consolazione',
        description:
          'Dopo la malinconia di Addio, Burgmüller offre una pagina che trasmette conforto e speranza. La melodia procede con calma, come le parole gentili di una persona che riesce a rassicurare chi soffre. L’atmosfera è raccolta e luminosa, invitando il pianista a cercare un’espressione sincera e pacata.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-14',
        title: 'Op. 100 n. 14',
        subtitle: 'Stiriana',
        description:
          'Il titolo rimanda alle danze popolari della Stiria, regione dell’Austria ricca di tradizioni musicali. Il ritmo vivace e il carattere festoso fanno immaginare una danza eseguita in piazza durante una festa di paese. La musica conserva sempre un’eleganza raffinata, pur mantenendo tutta l’energia tipica della danza.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-15',
        title: 'Op. 100 n. 15',
        subtitle: 'Ballata',
        description:
          'Nella tradizione romantica la ballata racconta una storia attraverso la musica. Anche questo brano sembra accompagnare l’ascoltatore lungo un piccolo racconto, alternando momenti di calma e di maggiore intensità. Più che descrivere un episodio preciso, Burgmüller lascia spazio all’immaginazione di chi ascolta.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-16',
        title: 'Op. 100 n. 16',
        subtitle: 'Dolce lamento',
        description:
          'Il titolo suggerisce una tristezza composta e mai disperata. La melodia sembra una voce che racconta con dolcezza un ricordo lontano, senza perdere la serenità. L’atmosfera è intima e riflessiva, e invita il pianista a lasciare che ogni frase si sviluppi con naturalezza, senza eccessi espressivi.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-17',
        title: 'Op. 100 n. 17',
        subtitle: 'Chiacchierina',
        description:
          'Come suggerisce il titolo, questo studio ricorda una conversazione vivace e spensierata. Le frasi musicali sembrano rincorrersi come parole scambiate tra amici, alternando leggerezza e vivacità. Burgmüller trasforma un semplice dialogo quotidiano in una pagina piena di naturalezza e buon umore.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-18',
        title: 'Op. 100 n. 18',
        subtitle: 'Inquietudine',
        description:
          "La musica esprime un senso di continua ricerca, come se qualcosa impedisse di trovare una completa serenità. Le frasi si susseguono con un lieve senso di tensione, senza mai perdere eleganza. Burgmüller descrive un'inquietudine delicata, più vicina al dubbio che alla paura.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-19',
        title: 'Op. 100 n. 19',
        subtitle: 'Ave Maria',
        description:
          "Questo brano si ispira al raccoglimento e alla serenità della preghiera. La melodia procede con grande equilibrio, creando un'atmosfera di pace e contemplazione. Più che stupire, la musica invita ad ascoltare con calma, lasciando emergere tutta la sua semplice spiritualità.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-20',
        title: 'Op. 100 n. 20',
        subtitle: 'Tarantella',
        description:
          'La celebre danza popolare italiana prende vita in uno studio ricco di energia e movimento. Il ritmo vivace suggerisce una festa animata, nella quale la musica sembra non fermarsi mai. Burgmüller conserva però la raffinatezza del suo stile, trasformando la danza in un brillante esercizio pianistico.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-21',
        title: 'Op. 100 n. 21',
        subtitle: 'Armonia degli angeli',
        description:
          "Il titolo invita a immaginare una musica leggera e luminosa, quasi sospesa nell'aria. Le melodie sembrano intrecciarsi con naturalezza, creando un senso di pace e serenità. Burgmüller dipinge un'atmosfera delicata, nella quale ogni nota contribuisce a costruire un equilibrio di grande dolcezza.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-22',
        title: 'Op. 100 n. 22',
        subtitle: 'Barcarola',
        description:
          "La barcarola richiama il lento ondeggiare di una barca che scivola sull'acqua. Il ritmo regolare accompagna una melodia distesa e cantabile, trasmettendo una piacevole sensazione di calma. La musica invita a lasciarsi trasportare con naturalezza, come durante una tranquilla navigazione.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-23',
        title: 'Op. 100 n. 23',
        subtitle: 'Ritorno',
        description:
          'Questo studio suggerisce la gioia di ritrovare un luogo o una persona cara dopo un periodo di lontananza. La musica alterna slancio e serenità, come se ogni frase avvicinasse sempre di più alla meta. Burgmüller racconta il ritorno con semplicità e sincera partecipazione.',
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-24',
        title: 'Op. 100 n. 24',
        subtitle: 'La rondine',
        description:
          "La leggerezza del volo di una rondine ispira questo elegante brano. Le linee melodiche sembrano disegnare piccoli archi nel cielo, alternando rapidità e grazia con assoluta naturalezza. Burgmüller riesce a evocare il movimento dell'uccello senza rinunciare alla chiarezza e all'equilibrio della scrittura.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
      {
        id: 'op100-25',
        title: 'Op. 100 n. 25',
        subtitle: 'La cavalcata',
        description:
          "L'ultimo studio della raccolta conclude il percorso con una pagina brillante e ricca di slancio. Il ritmo suggerisce il galoppo di un cavallo lanciato in una corsa sicura e decisa, simbolo del cammino compiuto dal giovane pianista. È un finale energico e ottimista, che chiude l'Op. 100 con entusiasmo e soddisfazione.",
        publishedAt: '',
        duration: '—',
        midi: { full: '', right: '', left: '' },
      },
    ],
  },
]
