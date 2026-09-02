export interface Lesson {
    id: string
    title: string
    duration: string
    isFree: boolean
    videoUrl?: string
}

export interface CourseModule {
    id: string
    title: string
    lessons: Lesson[]
}

export interface Course {
    id: string
    slug: string
    title: string
    description: string
    longDescription: string
    price: number
    category: 'modulare' | 'ableton' | 'serum' | 'max-msp' | 'pigments' | 'altro'
    level: 'beginner' | 'intermediate' | 'advanced'
    thumbnail: string
    lessonsCount: number
    duration: string
    features: string[]
    modules: CourseModule[]
}

export const coursesData: Record<string, Course> = {
    'synth-modulare-completo': {
        id: '1',
        slug: 'synth-modulare-completo',
        title: 'Synth Modulare Completo',
        description: 'Corso di Sound Design e Sintesi Modulare con VCV Rack.',
        longDescription: `Questo corso offre un’approfondita esplorazione della sintesi modulare attraverso VCV Rack, una piattaforma virtuale gratuita che simula il funzionamento di un sintetizzatore modulare hardware. Partendo dalle basi, il corso guida lo studente attraverso le diverse tecniche di sintesi sonora, permettendo di sviluppare competenze pratiche e teoriche nella creazione di suoni complessi e personalizzati.

Attraverso un percorso progressivo, verranno analizzate le principali tipologie di sintetizzatori e le tecniche di sintesi più avanzate, includendo sintesi additiva, sottrattiva, modulazione di frequenza (FM), cross FM e sintesi per modulazione di ampiezza. Gli studenti impareranno inoltre a utilizzare segnali di controllo (CV), filtri, inviluppi e sequenze di modulazione, costruendo patch creative e strutturate per la produzione musicale e il sound design.

Cosa imparerai:
- Comprendere il funzionamento di un sintetizzatore modulare e dei suoi componenti principali.
- Creare suoni originali attraverso diverse tecniche di sintesi.
- Sfruttare modulazioni avanzate per ottenere timbri complessi ed evolutivi.
- Integrare controller MIDI e sequenze per suonare e manipolare i suoni in tempo reale.
- Costruire patch complete per applicazioni musicali e di sound design.`,
        price: 50,
        category: 'modulare',
        level: 'intermediate',
        thumbnail: '/images/courses/synth_modulare_completo.jpg',
        lessonsCount: 42,
        duration: '12h 30m',
        features: [
            'Accesso lifetime al corso',
            'Aggiornamenti gratuiti',
            'Certificato di completamento',
            'Preset e patch files inclusi',
            'Supporto via community',
        ],
        modules: [
            {
                id: 'm1',
                title: 'Modulo 1: Introduzione alla Sintesi Modulare',
                lessons: [
                    { id: 'l1', title: 'Lezione 1 – Tipologie di Sintetizzatori', duration: '15:20', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Lezione 2 – Primi Collegamenti e Modulazioni Base', duration: '18:45', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Lezione 3 – Oscillatori e Forme d’Onda', duration: '22:10', isFree: false, videoUrl: '' },
                    { id: 'l4', title: 'Lezione 4 – v/oct, Gate e Controllo via Tastiera', duration: '20:30', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Modulo 2: Tecniche di Sintesi',
                lessons: [
                    { id: 'l5', title: 'Lezione 5 – Esperimenti in Sintesi Additiva', duration: '25:00', isFree: false, videoUrl: '' },
                    { id: 'l6', title: 'Lezione 6 – Sintesi Sottrattiva e Filtri', duration: '22:30', isFree: false, videoUrl: '' },
                    { id: 'l7', title: 'Lezione 7 – Esperimenti con i Filtri', duration: '28:15', isFree: false, videoUrl: '' },
                    { id: 'l8', title: 'Lezione 8 – Approfondimento sui Moduli NANO Modules', duration: '24:00', isFree: false, videoUrl: '' },
                    { id: 'l9', title: 'Lezione 9 – Sintesi FM e Cross FM', duration: '29:40', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
    'ableton-live-masterclass': {
        id: '2',
        slug: 'ableton-live-masterclass',
        title: 'Ableton Live Masterclass',
        description: 'Corso completo passo dopo passo per dominare Ableton Live.',
        longDescription: `Questo corso completo ti guiderà passo dopo passo nell'utilizzo di tutte le funzionalità di Ableton Live. 

Scoprirai come:
- Creare suoni unici: Esplora la sintesi analogica, wavetable e FM per dare vita a sonorità ricche e personalizzate.
- Modellare il suono: Impara a utilizzare una vasta gamma di effetti per dare forma al tuo suono e creare atmosfere uniche.
- Organizzare il tuo progetto: Ottimizza il tuo flusso di lavoro con Session View e Arrangement View.
- Produrre musica di qualità professionale: Mixa e masterizza le tue tracce per ottenere un risultato finale impeccabile.

Dalle basi della produzione musicale alle tecniche più avanzate, questo corso è perfetto sia per i principianti che per i produttori esperti che vogliono approfondire le loro conoscenze.`,
        price: 60,
        category: 'ableton',
        level: 'beginner',
        thumbnail: '/images/courses/ableton_live_masterclass.jpg',
        lessonsCount: 56,
        duration: '18h 45m',
        features: [
            'Accesso lifetime al corso',
            'Progetto Ableton completo incluso',
            'Sample pack esclusivo',
            'Supporto diretto via email',
        ],
        modules: [
            {
                id: 'm1',
                title: 'Setup e Configurazione',
                lessons: [
                    { id: 'l1', title: 'Installazione e preferenze', duration: '15:00', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Audio e MIDI settings', duration: '20:30', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Template personalizzato', duration: '25:00', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Session View & Produzione',
                lessons: [
                    { id: 'l4', title: 'Clip e Scene', duration: '22:00', isFree: false, videoUrl: '' },
                    { id: 'l5', title: 'Warping audio', duration: '28:30', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
    'serum-sound-design': {
        id: '3',
        slug: 'serum-sound-design',
        title: 'Serum Sound Design',
        description: 'Crea suoni unici con il wavetable synth più potente del mondo.',
        longDescription: `Domina il sound design con Xfer Serum. In questo corso imparerai a controllare ogni sezione del sintetizzatore wavetable più utilizzato al mondo.
        
Dalla teoria delle wavetable all'utilizzo dei filtri complessi, dalla modulazione avanzata con LFO ed inviluppi all'utilizzo ottimale della potente suite di effetti interni. Costruirai da zero bassi reese devastanti, lead taglienti, pad evolutivi ed effetti sonori cinematografici.`,
        price: 60,
        category: 'serum',
        level: 'advanced',
        thumbnail: '/images/courses/serum_sound_design.jpg',
        lessonsCount: 38,
        duration: '10h 15m',
        features: [
            'Accesso lifetime al corso',
            '50 Preset Serum esclusivi inclusi',
            'Supporto diretto via community',
            'File di progetto del corso',
        ],
        modules: [
            {
                id: 'm1',
                title: 'Interfaccia e Generatori',
                lessons: [
                    { id: 'l1', title: 'Panoramica della GUI', duration: '15:20', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Gli Oscillatori A e B', duration: '20:15', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Sub ed Noise Generator', duration: '18:40', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Modulazione ed Inviluppi',
                lessons: [
                    { id: 'l4', title: 'LFO avanzati e LFO shaping', duration: '22:10', isFree: false, videoUrl: '' },
                    { id: 'l5', title: 'Inviluppi e Modulation Matrix', duration: '26:30', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm3',
                title: 'Sound Design Pratico',
                lessons: [
                    { id: 'l6', title: 'Creare un Bass Lead Aggressivo', duration: '28:15', isFree: false, videoUrl: '' },
                    { id: 'l7', title: 'Drone e Pad Ambient Evolutivi', duration: '25:00', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
    'max-msp-fondamenti': {
        id: '4',
        slug: 'max-msp-fondamenti',
        title: 'Max MSP Fondamenti',
        description: 'Corso completo per la programmazione audio-visuale con Max/MSP.',
        longDescription: `Questo corso di Max/MSP è progettato per guidarti nei principi fondamentali della sintesi sonora e della manipolazione audio attraverso il potente ambiente di programmazione visiva Max. Attraverso lezioni pratiche e teoriche, imparerai a creare, modificare e controllare il suono in modo innovativo. 
  
Copriremo argomenti che vanno dai concetti base del suono e del MIDI fino alla progettazione di effetti audio avanzati come compressori e filtri.

Cosa imparerai:
- Creare patch audio personalizzate per applicazioni monofoniche e polifoniche.
- Progettare filtri digitali, equalizzatori grafici ed effetti di ritardo (delay, flanger, phaser, chorus).
- Sviluppare un compressore audio completo per gestire dinamicamente il segnale sonoro.
- Affrontare progetti di sound design con solide basi teoriche e pratiche.`,
        price: 60,
        category: 'max-msp',
        level: 'intermediate',
        thumbnail: '/images/courses/max_msp_fondamenti.jpg',
        lessonsCount: 35,
        duration: '14h 20m',
        features: [
            'Accesso lifetime al corso',
            'Patch Max complete da scaricare',
            'Supporto diretto via forum',
            'Certificato finale',
        ],
        modules: [
            {
                id: 'm1',
                title: 'Capitolo 1 & 2: Basi di Max MSP',
                lessons: [
                    { id: 'l1', title: 'Lezione 1: Il suono, forme d\'onda, frequenza e ampiezza', duration: '18:10', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Lezione 2: Primi Passi - applicazione di frequenza e ampiezza', duration: '22:30', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Lezione 3: Operatori binari, casualità, messaggi e astrazioni', duration: '20:15', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Capitolo 3: Campionamento e MIDI',
                lessons: [
                    { id: 'l4', title: 'Lezione 4: Campionamento e quantizzazione audio', duration: '24:00', isFree: false, videoUrl: '' },
                    { id: 'l5', title: 'Lezione 5: Il protocollo MIDI e la struttura esadecimale', duration: '27:50', isFree: false, videoUrl: '' },
                    { id: 'l6', title: 'Lezione 6: Pratica MIDI - patch monofoniche e polifoniche', duration: '25:10', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm3',
                title: 'Capitolo 4, 5 & 6: Filtri, Effetti e Compressione',
                lessons: [
                    { id: 'l7', title: 'Lezione 7: Filtri FIR/IIR di primo e secondo ordine', duration: '22:45', isFree: false, videoUrl: '' },
                    { id: 'l8', title: 'Lezione 8: Costruzione di equalizzatori grafici', duration: '26:10', isFree: false, videoUrl: '' },
                    { id: 'l9', title: 'Lezione 9: Linee di ritardo - Delay, Flanger, Phaser, Chorus', duration: '24:35', isFree: false, videoUrl: '' },
                    { id: 'l10', title: 'Lezione 10: Costruzione di effetti audio e delay multibanda', duration: '29:15', isFree: false, videoUrl: '' },
                    { id: 'l11', title: 'Lezione 11: L\'algoritmo di un compressore audio', duration: '21:50', isFree: false, videoUrl: '' },
                    { id: 'l12', title: 'Lezione 12: Costruzione pratica del compressore', duration: '28:30', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
    'pigments-masterclass': {
        id: '5',
        slug: 'pigments-masterclass',
        title: 'Pigments Masterclass',
        description: 'Masterclass per il sintetizzatore Arturia Pigments 4.',
        longDescription: `Questo tutorial ti guida passo dopo passo alla scoperta di Pigments 4, il sintetizzatore virtuale di Arturia. Un approfondimento completo che copre tutte le funzionalità del plugin, ideale sia per chi si avvicina per la prima volta al mondo dei sintetizzatori sia per i produttori esperti.

Il tutorial esplora:
- Tutti i motori di sintesi: Virtual Analog, Wavetable, Sample e Harmonic.
- L'uso avanzato di sequencer, arpeggiatore e modulazioni.
- Le tecniche per creare suoni originali e personalizzati.
- La gestione degli effetti integrati e la modellazione del suono.
- Le principali novità introdotte nella versione 4.
- Un'occasione per approfondire ogni dettaglio di Pigments 4 e massimizzare il suo potenziale nelle tue produzioni musicali.`,
        price: 15,
        category: 'pigments',
        level: 'beginner',
        thumbnail: '/images/courses/pigments_masterclass.jpg',
        lessonsCount: 28,
        duration: '8h 50m',
        features: [
            'Accesso lifetime al corso',
            'Patch pack esclusivo di 30 suoni',
            'Supporto diretto via community',
        ],
        modules: [
            {
                id: 'm1',
                title: 'I Motori di Sintesi',
                lessons: [
                    { id: 'l1', title: 'L\'interfaccia grafica ed il browser patch', duration: '12:40', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Engine Wavetable e Analogico', duration: '22:15', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Engine Sample e Sintesi Granulare', duration: '25:10', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Modulazione ed FX',
                lessons: [
                    { id: 'l4', title: 'Modulatori: LFO, Funzioni e Randomizer', duration: '24:30', isFree: false, videoUrl: '' },
                    { id: 'l5', title: 'Routing degli effetti e arpeggiatore', duration: '20:15', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
    'reaktor-blocks': {
        id: '6',
        slug: 'reaktor-blocks',
        title: 'Reaktor Blocks Completo',
        description: 'Modular nel box con Native Instruments Reaktor Blocks.',
        longDescription: `Reaktor Blocks unisce la flessibilità del mondo modulare Eurorack con la comodità del lavoro in-the-box. Utilizzando l'ambiente grafico di Reaktor, imparerai a cablare oscillatori, filtri, sequencer e utility di modulazione.
        
Questo corso ti insegnerà come strutturare synth complessi all'interno del computer, come integrare Reaktor Blocks con il tuo hardware Eurorack reale (tramite segnali DC-coupled) e come creare patch generative complesse ed evolutive.`,
        price: 50,
        category: 'modulare',
        level: 'advanced',
        thumbnail: '/images/courses/reaktor_blocks.jpg',
        lessonsCount: 44,
        duration: '16h 10m',
        features: [
            'Accesso lifetime al corso',
            'Templates di patching pronti all\'uso',
            'Supporto diretto via forum',
        ],
        modules: [
            {
                id: 'm1',
                title: 'I Blocks Fondamentali',
                lessons: [
                    { id: 'l1', title: 'Introduzione a Reaktor Blocks', duration: '14:30', isFree: true, videoUrl: '' },
                    { id: 'l2', title: 'Bento Box Blocks: VCO, VCF, VCA', duration: '22:15', isFree: true, videoUrl: '' },
                    { id: 'l3', title: 'Inviluppi e LFO modulari', duration: '18:50', isFree: false, videoUrl: '' },
                ],
            },
            {
                id: 'm2',
                title: 'Patching Avanzato',
                lessons: [
                    { id: 'l4', title: 'Sintesi FM e Modulazioni incrociate', duration: '26:40', isFree: false, videoUrl: '' },
                    { id: 'l5', title: 'Patch Generative e Sequencer casuali', duration: '28:10', isFree: false, videoUrl: '' },
                ],
            },
        ],
    },
}

export const allCoursesList: Course[] = Object.values(coursesData)
