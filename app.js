/* ==========================================================================
   TIMELINE BOARD GAME - MULTIPLAYER CORE ENGINE
   Fiel a las mecánicas del juego de mesa con 74 Eventos e Imágenes Oficiales
   Fuente: The Strong National Museum of Play (museumofplay.org)
   ========================================================================== */

const WEBHOOK_URL = "";

const HISTORICAL_EVENTS = [
  { id: 1, year: 1940, title: "Computadora Nim (Edward U. Condon)", desc: "Edward U. Condon diseña una computadora que juega al juego tradicional Nim. Decenas de miles de personas lo juegan y la computadora gana al menos el 90% de las partidas.", image: "https://www.museumofplay.org/app/uploads/2021/08/1940-1-384x497.jpg" },
  { id: 2, year: 1947, title: "Tubo de Rayos Catódicos (Goldsmith & Mann)", desc: "Thomas T. Goldsmith Jr. y Estle Ray Mann patentan un dispositivo de entretenimiento con pantalla de osciloscopio para disparar a un objetivo.", image: "https://www.museumofplay.org/app/uploads/2021/08/1947-2-384x497.jpg" },
  { id: 3, year: 1950, title: "Artículo de Ajedrez de Claude Shannon", desc: "Claude Shannon establece las pautas básicas para programar una computadora que juegue al ajedrez. Alan Turing también crea un programa de ajedrez este año.", image: "https://www.museumofplay.org/app/uploads/2021/08/1950-384x497.jpg" },
  { id: 4, year: 1952, title: "OXO - Tres en Raya (A.S. Douglas)", desc: "A. S. Douglas crea OXO en la computadora EDSAC de Cambridge como parte de su investigación sobre la interacción entre humanos y computadoras.", image: "https://www.museumofplay.org/app/uploads/2021/08/1952-384x497.jpg" },
  { id: 5, year: 1954, title: "Primer Programa de Blackjack (Los Álamos)", desc: "Programadores en los laboratorios de Los Álamos en Nuevo México desarrollan el primer programa de blackjack en una computadora IBM-701.", image: "https://www.museumofplay.org/app/uploads/2021/08/1954-384x497.jpg" },
  { id: 6, year: 1955, title: "Hutspiel (Simulación Militar EE. UU.)", desc: "La tradición de los juegos de guerra entra en la era informática cuando el ejército de EE. UU. diseña Hutspiel entre comandantes de la OTAN y soviéticos.", image: "https://www.museumofplay.org/app/uploads/2021/08/1955-384x497.jpg" },
  { id: 7, year: 1956, title: "Programa de Damas de Arthur Samuel", desc: "Arthur Samuel demuestra en televisión su programa informático de damas en una IBM-701. Seis años más tarde logra derrotar a un maestro de damas.", image: "https://www.museumofplay.org/app/uploads/2021/08/1956-384x497.jpg" },
  { id: 8, year: 1957, title: "Ajedrez Avanzado en IBM-704 (Alex Bernstein)", desc: "Alex Bernstein escribe el primer programa completo de ajedrez capaz de evaluar cuatro jugadas intermedias hacia adelante.", image: "https://www.museumofplay.org/app/uploads/2021/08/1957-384x497.jpg" },
  { id: 9, year: 1958, title: "Tennis for Two (Willy Higinbotham)", desc: "Willy Higinbotham crea un juego de tenis en un osciloscopio y una computadora analógica para una demostración pública en Brookhaven Laboratory.", image: "https://www.museumofplay.org/app/uploads/2021/08/1958-copy-384x497.png" },
  { id: 10, year: 1959, title: "Mouse in the Maze (MIT TX-0)", desc: "Estudiantes del MIT crean Mouse in the Maze. Los usuarios dibujaban un laberinto con lápiz óptico y un ratón lo navegaba buscando queso o martinis.", image: "https://www.museumofplay.org/app/uploads/2021/08/1959-copy-384x497.png" },
  { id: 11, year: 1960, title: "Simulación de Béisbol por Computadora", desc: "John Burgeson desarrolla en su hogar la primera simulación de béisbol ejecutada en una computadora IBM 1620.", image: "https://www.museumofplay.org/app/uploads/2021/08/1960-Burgeson-BBC-73-384x497.jpg" },
  { id: 12, year: 1961, title: "Grand Strategy (Raytheon Guerra Fría)", desc: "Raytheon desarrolla una simulación por computadora del conflicto de la Guerra Fría para el Estado Mayor Conjunto de los EE. UU.", image: "https://www.museumofplay.org/app/uploads/2021/08/1961-Raytheon-Cold-War-Conflict-Simulation-384x497.jpg" },
  { id: 13, year: 1962, title: "Spacewar! (Steve Russell en el MIT)", desc: "Steve Russell inventa Spacewar! en la computadora PDP-1 del MIT, el primer videojuego interactivo de combate espacial.", image: "https://www.museumofplay.org/app/uploads/2021/08/1962-final-384x497.jpg" },
  { id: 14, year: 1963, title: "STAGE (Juego de Guerra Termonuclear)", desc: "El Departamento de Defensa de EE. UU. completa STAGE, un juego de guerra informático sobre intercambio atómico global.", image: "https://www.museumofplay.org/app/uploads/2021/08/1963-384x497.jpg" },
  { id: 15, year: 1964, title: "Lenguaje BASIC y Sistema Dartmouth", desc: "John Kemeny crea BASIC y el sistema de tiempo compartido, facilitando a los estudiantes la creación de múltiples juegos de computadora.", image: "https://www.museumofplay.org/app/uploads/2021/08/1964-BASIC-copy-384x497.jpg" },
  { id: 16, year: 1965, title: "Primer Juego de Fútbol Americano por Computadora", desc: "Un estudiante de Dartmouth programa el primer juego de fútbol americano por computadora en BASIC tras ganar el campeonato.", image: "https://www.museumofplay.org/app/uploads/2021/08/1965-copy-384x497.png" },
  { id: 17, year: 1966, title: "Concepción del Videojuego de TV (Ralph Baer)", desc: "Ralph Baer concibe la idea de jugar videojuegos en un televisor mientras esperaba un autobús en Nueva York.", image: "https://www.museumofplay.org/app/uploads/2021/08/1966-correct-image-copy_0-384x497.png" },
  { id: 18, year: 1967, title: "Prototipo 'Brown Box' (Ralph Baer)", desc: "Ralph Baer desarrolla la 'Brown Box', el prototipo de consola doméstica que permite jugar al tenis en la televisión.", image: "https://www.museumofplay.org/app/uploads/2021/08/1967-Brown-Box-384x497.png" },
  { id: 19, year: 1968, title: "Patente del Juego de TV Interactivo", desc: "Ralph Baer patenta su juego de TV interactivo. Cuatro años más tarde daría origen a la Magnavox Odyssey.", image: "https://www.museumofplay.org/app/uploads/2021/08/1968-Odyssey-384x497.jpg" },
  { id: 20, year: 1970, title: "Juego de la Vida (Conway's LIFE)", desc: "Scientific American publica las reglas de LIFE de Martin Gardner. Hackers observan cómo células nacen y mueren en computadoras.", image: "https://www.museumofplay.org/app/uploads/2021/08/1970-life-copy-384x497.png" },
  { id: 21, year: 1971, title: "The Oregon Trail", desc: "Don Rawitsch, Bill Heinemann y Paul Dillenberger crean Oregon Trail, la mítica simulación del viaje de los pioneros hacia el oeste.", image: "https://www.museumofplay.org/app/uploads/2021/08/1971-The-Oregon-Trail-Game-384x497.jpg" },
  { id: 22, year: 1972, title: "Nacimiento de Pong (Atari)", desc: "Nolan Bushnell y Al Alcorn lanzan Pong en arcade. La máquina en la taberna Andy Capps deja de funcionar por estar atascada de monedas.", image: "https://www.museumofplay.org/app/uploads/2021/08/1972-Pong-copy-384x497.jpg" },
  { id: 23, year: 1973, title: "Libro '101 BASIC Computer Games'", desc: "David Ahl publica 101 BASIC Computer Games, permitiendo a los jugadores convertirse en reyes sumerios o comandar la Guerra Civil.", image: "https://www.museumofplay.org/app/uploads/2021/08/1973_0-384x497.jpg" },
  { id: 24, year: 1974, title: "Maze Wars (Primer FPS 3D)", desc: "Maze Wars introduce el primer juego de disparos en primera persona en pasadizos gráficos de alambre.", image: "https://www.museumofplay.org/app/uploads/2021/08/1974-384x497.jpg" },
  { id: 25, year: 1975, title: "Home Pong (Consola Doméstica de Atari)", desc: "Atari introduce la versión doméstica de Pong, vendiendo las primeras unidades a través de las tiendas Sears Roebuck.", image: "https://www.museumofplay.org/app/uploads/2021/08/1975-Atari-Pong-Home-Console-384x497.jpg" },
  { id: 26, year: 1976, title: "Adventure (Colossal Cave Adventure)", desc: "Don Woods amplía el juego conversacional de William Crowther, abriendo el camino para Zork y los juegos de rol por computadora.", image: "https://www.museumofplay.org/app/uploads/2021/08/1976-copy-384x497.png" },
  { id: 27, year: 1977, title: "Atari 2600 (Video Computer System)", desc: "Atari lanza la mítica consola 2600 con joysticks y cartuchos intercambiables a color en los hogares de millones de estadounidenses.", image: "https://www.museumofplay.org/app/uploads/2021/08/1977-384x497.jpg" },
  { id: 28, year: 1978, title: "Space Invaders (Taito)", desc: "Space Invaders de Taito desciende sobre Japón causando escasez de monedas de 100 yenes y convirtiéndose en fenómeno mundial.", image: "https://www.museumofplay.org/app/uploads/2021/08/1978-384x497.jpg" },
  { id: 29, year: 1979, title: "Intellivision (Mattel)", desc: "Mattel lanza la consola Intellivision con gráficos superiores a Atari 2600, vendiendo 3 millones de unidades.", image: "https://www.museumofplay.org/app/uploads/2021/08/1979-384x497.jpg" },
  { id: 30, year: 1980, title: "Pac-Man (Namco)", desc: "Toru Iwatani crea Pac-Man para Namco, el arcade más vendido de la historia e ícono absoluto de la cultura pop.", image: "https://www.museumofplay.org/app/uploads/2021/08/1980_0-384x497.jpg" },
  { id: 31, year: 1981, title: "Donkey Kong (Nintendo)", desc: "Shigeru Miyamoto crea Donkey Kong en arcade, introduciendo a Jumpman (Mario) y definiendo el género de plataformas.", image: "https://www.museumofplay.org/app/uploads/2021/08/1981-Plush-Mario-384x497.jpg" },
  { id: 32, year: 1982, title: "Película y Arcade TRON & Ms. Pac-Man", desc: "Disney lanza TRON y su arcade derivado. Al mismo tiempo, Ms. Pac-Man se convierte en uno de los juegos más exitosos.", image: "https://www.museumofplay.org/app/uploads/2021/08/1982-384x497.jpg" },
  { id: 33, year: 1983, title: "Crisis de los Videojuegos de 1983", desc: "La industria norteamericana sufre un colapso masivo por la saturación de consolas de baja calidad y juegos deficientes.", image: "https://upload.wikimedia.org/wikipedia/en/f/f8/Etvideogamecover.jpg" },
  { id: 34, year: 1984, title: "Tetris (Alexey Pajitnov)", desc: "Alexey Pajitnov diseña Tetris en una computadora BESM-6 en Moscú, convirtiéndose en un rompecabezas viral planetario.", image: "https://www.museumofplay.org/app/uploads/2021/08/tetris-384x497.png" },
  { id: 35, year: 1985, title: "Consola NES & Super Mario Bros", desc: "Nintendo lanza la NES en América del Norte, salvando la industria doméstica con el legendario Super Mario Bros.", image: "https://www.museumofplay.org/app/uploads/2021/08/1985-384x497.jpg" },
  { id: 36, year: 1986, title: "Reader Rabbit (Software Educativo)", desc: "The Learning Company introduce Reader Rabbit, marcando el avance del software educativo e interactivo.", image: "https://www.museumofplay.org/app/uploads/2021/08/1986-Reader-rabbit-384x497.jpg" },
  { id: 37, year: 1987, title: "The Legend of Zelda & Juegos de Rol", desc: "Shigeru Miyamoto lanza The Legend of Zelda, Sierra crea Leisure Suit Larry y SSI obtiene la licencia de D&D.", image: "https://www.museumofplay.org/app/uploads/2021/08/1987-Legend-of-Zelda-copy-384x497.jpg" },
  { id: 38, year: 1988, title: "John Madden Football", desc: "John Madden Football introduce el realismo de los deportes profesionales en computadora, iniciando una saga récord.", image: "https://www.museumofplay.org/app/uploads/2021/08/1988-384x497.jpg" },
  { id: 39, year: 1989, title: "Nintendo Game Boy", desc: "Nintendo lanza la portátil Game Boy con Tetris, popularizando el juego portátil gracias a su autonomía.", image: "https://www.museumofplay.org/app/uploads/2021/08/1989-Game-Boy-384x497.jpg" },
  { id: 40, year: 1990, title: "Solitario en Windows 3.0", desc: "Microsoft incluye el Solitario en Windows 3.0, masificando los juegos casuales en computadoras de oficina y hogares.", image: "https://www.museumofplay.org/app/uploads/2021/08/1990_0-384x497.png" },
  { id: 41, year: 1991, title: "Sonic the Hedgehog (Sega Genesis)", desc: "Sega presenta a Sonic para competir contra Nintendo en la era de los 16-bits con supervelocidad y actitud.", image: "https://www.museumofplay.org/app/uploads/2021/08/1991-Sega-Sonic_0-384x497.jpg" },
  { id: 42, year: 1992, title: "Dune II (Estrategia en Tiempo Real)", desc: "Westwood Studios lanza Dune II, definiendo las bases del género de estrategia en tiempo real (RTS).", image: "https://www.museumofplay.org/app/uploads/2021/08/1992-DUNE-II-384x497.jpg" },
  { id: 43, year: 1993, title: "Doom & Clasificación ESRB", desc: "id Software lanza Doom revolucionando los FPS 3D. El debate por violencia en Mortal Kombat motiva el sistema de clasificación.", image: "https://www.museumofplay.org/app/uploads/2021/08/1993-384x497.png" },
  { id: 44, year: 1994, title: "Warcraft: Orcs and Humans", desc: "Blizzard lanza Warcraft, introduciendo a millones de jugadores al universo fantástico de Azeroth.", image: "https://www.museumofplay.org/app/uploads/2021/08/1994-WarCraft-copy_0-384x497.jpg" },
  { id: 45, year: 1995, title: "Sony PlayStation", desc: "Sony debuta con la consola PlayStation en América del Norte, masificando el formato CD-ROM en 3D.", image: "https://www.museumofplay.org/app/uploads/2021/08/1995-384x497.jpg" },
  { id: 46, year: 1996, title: "Lara Croft en Tomb Raider", desc: "Debuta Lara Croft en Tomb Raider de Eidos, convirtiéndose en un ícono cultural de aventuras tridimensionales.", image: "https://www.museumofplay.org/app/uploads/2021/08/Tomb-Raider-sq-384x497.jpg" },
  { id: 47, year: 1997, title: "Deep Blue Derrota a Garry Kasparov", desc: "La supercomputadora de IBM Deep Blue derrota en un duelo de ajedrez al campeón mundial Garry Kasparov.", image: "https://www.museumofplay.org/app/uploads/2021/08/1997-Deep-Blue-Flickr-Shiny-Things-384x497.jpg" },
  { id: 48, year: 1998, title: "The Legend of Zelda: Ocarina of Time", desc: "Nintendo 64 recibe Ocarina of Time, considerado uno de los mejores videojuegos de la historia por sus mecánicas 3D.", image: "https://www.museumofplay.org/app/uploads/2021/08/Zelda-Ocarina-copy-384x497.jpg" },
  { id: 49, year: 1999, title: "EverQuest (MMORPG)", desc: "EverQuest de Sony atrae a cientos de miles de jugadores a unirse a gremios y explorar el mundo en línea de Norrath.", image: "https://www.museumofplay.org/app/uploads/2021/08/1999-Ever-Quest-384x497.jpg" },
  { id: 50, year: 2000, title: "The Sims (Will Wright)", desc: "The Sims simula la vida cotidiana y se convierte en el juego de PC más vendido de la historia.", image: "https://www.museumofplay.org/app/uploads/2021/08/2000-copy-384x497.png" },
  { id: 51, year: 2001, title: "Microsoft Xbox & Halo", desc: "Microsoft ingresa a las consolas con Xbox y Halo: Combat Evolved, popularizando el juego en red.", image: "https://www.museumofplay.org/app/uploads/2021/08/2001-384x497.jpg" },
  { id: 52, year: 2002, title: "America's Army & Serious Games", desc: "El ejército de EE. UU. lanza America's Army para reclutamiento y se crea la Serious Games Initiative.", image: "https://www.museumofplay.org/app/uploads/2021/08/2002-Army-copy-384x497.jpg" },
  { id: 53, year: 2003, title: "Plataforma Steam (Valve)", desc: "Valve lanza Steam, revolucionando la distribución digital de videojuegos y actualizaciones en PC.", image: "https://www.museumofplay.org/app/uploads/2021/08/2003-Steam-384x497.jpg" },
  { id: 54, year: 2004, title: "Nintendo DS (Doble Pantalla Táctil)", desc: "Nintendo lanza la portátil DS con doble pantalla y lápiz táctil, vendiendo más de 150 millones de unidades.", image: "https://www.museumofplay.org/app/uploads/2021/08/2004-Nintendo-DS-384x497.jpg" },
  { id: 55, year: 2005, title: "Xbox 360 & HD Gaming", desc: "Microsoft lanza Xbox 360 aportando gráficos en alta definición y juego en línea con Xbox Live.", image: "https://www.museumofplay.org/app/uploads/2021/08/2005-copy-384x497.jpg" },
  { id: 56, year: 2006, title: "Nintendo Wii & Controles de Movimiento", desc: "Nintendo presenta la Wii con mandos sensibles al movimiento, atrayendo a millones de nuevos jugadores.", image: "https://www.museumofplay.org/app/uploads/2021/08/2006-Wii-384x497.jpg" },
  { id: 57, year: 2007, title: "Rock Band (Harmonix)", desc: "Rock Band permite a grupos de amigos tocar guitarra, bajo, batería y cantar simulando bandas de rock.", image: "https://www.museumofplay.org/app/uploads/2021/08/2007-Rock-band_0-384x497.jpg" },
  { id: 58, year: 2008, title: "World of Warcraft 10M Suscriptores", desc: "WoW supera los 10 millones de suscriptores, estableciendo los MMO como fenómenos sociales mundiales.", image: "https://www.museumofplay.org/app/uploads/2021/08/WoW-individual-384x497.jpg" },
  { id: 59, year: 2009, title: "Angry Birds & Farmville (Juegos Sociales)", desc: "Angry Birds en iPhone y Farmville en Facebook marcan el boom del gaming móvil y casual.", image: "https://www.museumofplay.org/app/uploads/2021/08/2009-copy-384x497.png" },
  { id: 60, year: 2010, title: "Minecraft (Markus Persson)", desc: "Markus 'Notch' Persson lanza Minecraft, el fenómeno indie sandbox más vendido de la historia.", image: "https://www.museumofplay.org/app/uploads/2021/08/Minecraft-sq-384x497.jpg" },
  { id: 61, year: 2011, title: "Skylanders (Juguetes Cobra Vida AR)", desc: "Skylanders combina figuras físicas con portales de lectura NFC para introducirlas en el juego.", image: "https://www.museumofplay.org/app/uploads/2021/08/2011-Skylanders-384x497.jpg" },
  { id: 62, year: 2012, title: "Crowdfunding en Kickstarter (Oculus Rift)", desc: "Kickstarter permite recaudar millones para proyectos independientes como Oculus Rift y OUYA.", image: "https://www.museumofplay.org/app/uploads/2021/08/2012-OUYA-Kickstarter-copy-384x497.png" },
  { id: 63, year: 2013, title: "The Last of Us & Narrativas Maduras", desc: "The Last of Us, Gone Home y Papers Please marcan el triunfo de historias maduras con dilemas éticos.", image: "https://www.museumofplay.org/app/uploads/2021/08/2013-Gone-Home-384x497.jpg" },
  { id: 64, year: 2014, title: "Modelo Free-to-Play y Microtransacciones", desc: "Clash of Clans y World of Tanks consolidan el modelo gratuito con compras dentro de la app.", image: "https://www.museumofplay.org/app/uploads/2021/08/2014-World-of-Tanks-384x497.jpg" },
  { id: 65, year: 2015, title: "Twitch & Auge de eSports", desc: "El Campeonato Mundial de League of Legends en Twitch supera en audiencia a grandes eventos deportivos.", image: "https://www.museumofplay.org/app/uploads/2021/08/2015-Twitch_0-384x497.jpg" },
  { id: 66, year: 2016, title: "Pokémon GO (Realidad Aumentada)", desc: "Niantic lanza Pokémon GO, sacando a millones a las calles a capturar criaturas en el mundo real.", image: "https://www.museumofplay.org/app/uploads/2021/08/2016-Pokemon-Go-Horsea-384x497.jpg" },
  { id: 67, year: 2017, title: "Nintendo Switch (Consola Híbrida)", desc: "Nintendo lanza la Switch junto a Zelda: Breath of the Wild, permitiendo jugar en TV y portátil.", image: "https://www.museumofplay.org/app/uploads/2021/08/2018-Nintendo-Switch-384x497.jpg" },
  { id: 68, year: 2018, title: "Xbox Adaptive Controller (Accesibilidad)", desc: "Microsoft presenta el Adaptive Controller para permitir a jugadores con movilidad reducida jugar.", image: "https://www.museumofplay.org/app/uploads/2021/08/2018-Adaptive-controller-384x497.jpg" },
  { id: 69, year: 2019, title: "Evento 'Black Hole' en Fortnite", desc: "Un asteroide destruye el mapa de Fortnite en un evento en vivo visto por millones antes del Capítulo 2.", image: "https://www.museumofplay.org/app/uploads/2021/08/Fortnite-384x497.jpg" },
  { id: 70, year: 2020, title: "Animal Crossing, Among Us & Pandemia", desc: "La pandemia impulsa juegos sociales de convivencia y deducción para conectar amigos a distancia.", image: "https://www.museumofplay.org/app/uploads/2021/08/Animal-crossing-384x497.jpg" },
  { id: 71, year: 2021, title: "Hades Gana el Premio Hugo", desc: "El roguelike Hades se convierte en el primer videojuego en recibir un prestigioso Premio Hugo de literatura.", image: "https://www.museumofplay.org/app/uploads/2022/02/Hades2-384x497.png" },
  { id: 72, year: 2022, title: "NYT Adquiere Wordle", desc: "The New York Times compra el adictivo juego viral de acertijos diarios de 5 letras Wordle.", image: "https://www.museumofplay.org/app/uploads/2023/06/wordle-384x497.jpg" },
  { id: 73, year: 2023, title: "Super Mario Movie & Serie The Last of Us", desc: "Los videojuegos triunfan en cine y TV con Mario Movie ($1.300M en taquilla) y la serie de HBO.", image: "https://www.museumofplay.org/app/uploads/2025/03/TheLastofUs_04-384x497.jpg" },
  { id: 74, year: 2024, title: "Astro Bot (Homenaje a PlayStation)", desc: "Astro Bot es aclamado mundialmente como el juego de plataformas del año en homenaje al gaming.", image: "https://www.museumofplay.org/app/uploads/2025/08/Video-game-2024-384x497.jpg" }
];

const ALL_TEAMS = [
  { id: 0, name: "Equipo Alfa", color: "var(--color-neon-pink)", icon: "🔴" },
  { id: 1, name: "Equipo Beta", color: "var(--color-neon-cyan)", icon: "🔵" },
  { id: 2, name: "Equipo Gamma", color: "var(--color-neon-yellow)", icon: "🟡" },
  { id: 3, name: "Equipo Delta", color: "var(--color-neon-green)", icon: "🟢" }
];

// STATE MANAGEMENT
let gameState = {
  userRole: "teacher", // "teacher" or "student"
  gameMode: "projector", // "projector" or "online"
  numTeams: 4,
  initialCardsPerTeam: 4,
  
  playerName: "",
  userTeamId: 0,
  roomCode: "AULA-101",
  joinedStudents: [],
  
  reserveDeck: [],
  tableCards: [],
  
  teamHands: { 0: [], 1: [], 2: [], 3: [] },
  teamStats: {
    0: { correct: 0, errors: 0, attempts: 0 },
    1: { correct: 0, errors: 0, attempts: 0 },
    2: { correct: 0, errors: 0, attempts: 0 },
    3: { correct: 0, errors: 0, attempts: 0 }
  },

  cardErrorTracker: {},
  currentTurnTeamIndex: 0,
  selectedHandCardId: null,
  
  turnTimeLeft: 60,
  turnTimerInterval: null,
  
  teamStreaks: { 0: 0, 1: 0, 2: 0, 3: 0 },
  chatMessages: [],
  isGameOver: false
};

// AUDIO SYNTHESIZER
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'tick') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'success') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    osc.frequency.setValueAtTime(783.99, now + 0.16);
    osc.frequency.setValueAtTime(1046.50, now + 0.24);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'victory') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.15);
    osc.frequency.setValueAtTime(659.25, now + 0.3);
    osc.frequency.setValueAtTime(880, now + 0.45);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const colors = ['#00f3ff', '#ff0055', '#ffea00', '#00ff66', '#9d00ff'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)], alpha: 1
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.alpha -= 0.015;
      if (p.alpha > 0) {
        active = true;
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
    if (active) requestAnimationFrame(render);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  render();
}

/* ==========================================================================
   INITIALIZATION & ROLE SELECTION FLOW
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderTeacherDashboard();
  setInterval(renderTeacherDashboard, 5000);
  setupTimelineScrollWheel();
});

function switchView(viewName) {
  const studentView = document.getElementById("studentView");
  const teacherView = document.getElementById("teacherView");
  const tabStudentBtn = document.getElementById("tabStudentBtn");
  const tabTeacherBtn = document.getElementById("tabTeacherBtn");

  if (viewName === 'student') {
    studentView.classList.add("view-section--active");
    teacherView.classList.remove("view-section--active");
    tabStudentBtn.className = "app-header__tab-btn app-header__tab-btn--active";
    tabTeacherBtn.className = "app-header__tab-btn";
  } else {
    teacherView.classList.add("view-section--active");
    studentView.classList.remove("view-section--active");
    tabStudentBtn.className = "app-header__tab-btn";
    tabTeacherBtn.className = "app-header__tab-btn app-header__tab-btn--active-teacher";
    renderTeacherDashboard();
  }
}

function openRoleSelectionModal() {
  closeAllModals();
  document.getElementById("modalRoleSelection").classList.add("modal-overlay--active");
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("modal-overlay--active"));
}

function selectInitialRole(role) {
  gameState.userRole = role;
  closeAllModals();
  if (role === 'teacher') {
    document.getElementById("modalTeacherConfig").classList.add("modal-overlay--active");
    toggleTeacherModeFields();
  } else {
    document.getElementById("modalStudentJoin").classList.add("modal-overlay--active");
  }
}

function toggleTeacherModeFields() {
  const mode = document.getElementById("selectGameModeSetting").value;
  const studentListGroup = document.getElementById("teacherStudentListGroup");
  const roomCodeGroup = document.getElementById("teacherRoomCodeGroup");

  if (mode === 'projector') {
    studentListGroup.style.display = "flex";
    roomCodeGroup.style.display = "none";
  } else {
    studentListGroup.style.display = "none";
    roomCodeGroup.style.display = "flex";
  }
}

function handleTeacherSubmitConfig(e) {
  e.preventDefault();
  gameState.userRole = "teacher";
  const mode = document.getElementById("selectGameModeSetting").value;
  const numTeams = parseInt(document.getElementById("selectNumTeamsSetting").value, 10);
  
  gameState.gameMode = mode;
  gameState.numTeams = numTeams;
  
  if (numTeams === 2) gameState.initialCardsPerTeam = 6;
  else if (numTeams === 3) gameState.initialCardsPerTeam = 5;
  else gameState.initialCardsPerTeam = 4;

  gameState.joinedStudents = [];

  if (mode === 'projector') {
    const rawList = document.getElementById("textareaStudentList").value.trim();
    if (rawList) {
      const names = rawList.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
      names.forEach((name, idx) => {
        const teamId = idx % numTeams;
        gameState.joinedStudents.push({ name, teamId });
      });
    }
  }

  closeAllModals();
  applyGameModeUI();
  initNewGame();
}

function handleStudentJoinSubmit(e) {
  e.preventDefault();
  gameState.userRole = "student";
  const name = document.getElementById("inputStudentNameJoin").value.trim();
  const code = document.getElementById("inputStudentRoomCode").value.trim();
  if (!name) return;

  gameState.playerName = name;
  gameState.roomCode = code;
  gameState.gameMode = "online";

  const assignedTeamIndex = gameState.joinedStudents.length % gameState.numTeams;
  gameState.userTeamId = assignedTeamIndex;
  gameState.joinedStudents.push({ name, teamId: assignedTeamIndex });

  closeAllModals();
  applyGameModeUI();
  initNewGame();
}

function applyGameModeUI() {
  const layout = document.getElementById("mainGameLayout");
  const chatSidebar = document.getElementById("teamChatSidebar");
  const playerBox = document.getElementById("hudCardPlayerBox");
  const modeLabel = document.getElementById("currentModeLabel");
  const teamsBadge = document.getElementById("activeTeamsBadge");
  const btnChangeMode = document.getElementById("btnChangeModeSetting");

  teamsBadge.textContent = `${gameState.numTeams} Equipos Activos`;

  if (gameState.userRole === 'teacher') {
    if (btnChangeMode) btnChangeMode.style.display = "inline-flex";
  } else {
    if (btnChangeMode) btnChangeMode.style.display = "none";
  }

  if (gameState.gameMode === 'projector') {
    modeLabel.textContent = "📺 Proyector de Aula (1 Pantalla)";
    layout.classList.add("game-layout--no-chat");
    if (chatSidebar) chatSidebar.style.display = "none";
    if (playerBox) playerBox.style.display = "none";
  } else {
    modeLabel.textContent = "📱 Multijugador Online (Celulares)";
    layout.classList.remove("game-layout--no-chat");
    if (chatSidebar) chatSidebar.style.display = "flex";
    if (playerBox) playerBox.style.display = "flex";
  }
}

function openViewTeamsModal() {
  const container = document.getElementById("modalTeamsRosterContent");
  container.innerHTML = "";

  for (let t = 0; t < gameState.numTeams; t++) {
    const team = ALL_TEAMS[t];
    const members = gameState.joinedStudents.filter(s => s.teamId === t);

    const box = document.createElement("div");
    box.className = "lobby-team-box";
    box.innerHTML = `
      <div class="lobby-team-box__title" style="color: ${team.color};">${team.icon} ${team.name} (${members.length} integrantes)</div>
      <ul class="lobby-team-box__list">
        ${members.length > 0 ? members.map(m => `<li>👤 ${m.name}</li>`).join("") : `<li style="color: var(--color-text-muted);">Sin asignaciones registradas</li>`}
      </ul>
    `;
    container.appendChild(box);
  }

  document.getElementById("modalViewTeams").classList.add("modal-overlay--active");
}

function closeViewTeamsModal() {
  document.getElementById("modalViewTeams").classList.remove("modal-overlay--active");
}

function setupTimelineScrollWheel() {
  const track = document.getElementById("timelineTrack");
  if (!track) return;
  track.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0) {
      track.scrollLeft += e.deltaY * 1.5;
      e.preventDefault();
    }
  });
}

function scrollTimelineTrack(distance) {
  const track = document.getElementById("timelineTrack");
  if (track) {
    track.scrollBy({ left: distance, behavior: 'smooth' });
  }
}

/* ==========================================================================
   GAMEPLAY ENGINE
   ========================================================================== */

function initNewGame() {
  gameState.reserveDeck = shuffleArray([...HISTORICAL_EVENTS]);
  gameState.tableCards = [];
  gameState.teamHands = { 0: [], 1: [], 2: [], 3: [] };
  gameState.teamStats = {
    0: { correct: 0, errors: 0, attempts: 0 },
    1: { correct: 0, errors: 0, attempts: 0 },
    2: { correct: 0, errors: 0, attempts: 0 },
    3: { correct: 0, errors: 0, attempts: 0 }
  };
  gameState.cardErrorTracker = {};
  gameState.currentTurnTeamIndex = Math.floor(Math.random() * gameState.numTeams);
  gameState.selectedHandCardId = null;
  gameState.teamStreaks = { 0: 0, 1: 0, 2: 0, 3: 0 };
  gameState.isGameOver = false;

  const anchorCard = gameState.reserveDeck.pop();
  gameState.tableCards.push(anchorCard);

  for (let t = 0; t < gameState.numTeams; t++) {
    for (let c = 0; c < gameState.initialCardsPerTeam; c++) {
      if (gameState.reserveDeck.length > 0) {
        gameState.teamHands[t].push(gameState.reserveDeck.pop());
      }
    }
  }

  updateHud();
  renderTimelineTable();
  renderTeamHand();
  startTurnTimer();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 🎯 CORRECCIÓN CLAVE DEL MISMATCH DE EQUIPO VS JUGADOR
function updateHud() {
  if (gameState.gameMode === 'projector') {
    gameState.userTeamId = gameState.currentTurnTeamIndex;
  }

  const currentTeam = ALL_TEAMS[gameState.currentTurnTeamIndex];
  document.getElementById("hudTeamName").textContent = `${currentTeam.icon} ${currentTeam.name}`;
  
  // OBTENER SOLAMENTE MIEMBROS ASIGNADOS AL EQUIPO QUE TIENE EL TURNO ACTIVO
  const activeTeamMembers = gameState.joinedStudents.filter(s => s.teamId === gameState.currentTurnTeamIndex);
  let activePlayerName = "";
  
  if (activeTeamMembers.length > 0) {
    const randomMember = activeTeamMembers[Math.floor(Math.random() * activeTeamMembers.length)];
    activePlayerName = randomMember.name;
  } else {
    // SI EL EQUIPO EN TURNO NO TIENE INTEGRANTES REGISTRADOS, MOSTRAR NOMBRE DEL EQUIPO Y NO FALLBACK A OTRO ESTUDIANTE
    activePlayerName = `Representante ${currentTeam.name}`;
  }

  const playerValEl = document.getElementById("hudActiveTurnPlayer");
  if (playerValEl) playerValEl.textContent = activePlayerName;
  
  const currentHand = gameState.teamHands[gameState.userTeamId] || [];
  document.getElementById("handCountLabel").textContent = `${currentHand.length} cartas restantes en mano de ${ALL_TEAMS[gameState.userTeamId].name}`;
}

function startTurnTimer() {
  if (gameState.turnTimerInterval) clearInterval(gameState.turnTimerInterval);
  gameState.turnTimeLeft = 60;
  updateTimerUI();

  gameState.turnTimerInterval = setInterval(() => {
    gameState.turnTimeLeft--;
    updateTimerUI();

    if (gameState.turnTimeLeft <= 5 && gameState.turnTimeLeft > 0) {
      playSynthSound('tick');
    }

    if (gameState.turnTimeLeft <= 0) {
      clearInterval(gameState.turnTimerInterval);
      handleTurnTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  document.getElementById("hudTurnTimer").textContent = `${gameState.turnTimeLeft}s`;
  const pct = (gameState.turnTimeLeft / 60) * 100;
  const fill = document.getElementById("hudTimerFill");
  fill.style.width = `${pct}%`;

  if (gameState.turnTimeLeft <= 5) {
    fill.classList.add("timer-bar__fill--critical");
  } else {
    fill.classList.remove("timer-bar__fill--critical");
  }
}

function handleTurnTimeout() {
  playSynthSound('error');
  addChatMessage("🤖 Sistema", `⏱️ ¡Tiempo agotado (60s)! ${ALL_TEAMS[gameState.currentTurnTeamIndex].name} pierde el turno.`);
  gameState.teamStreaks[gameState.currentTurnTeamIndex] = 0;
  advanceTurn();
}

function renderTimelineTable() {
  const track = document.getElementById("timelineTrack");
  track.innerHTML = "";

  const count = gameState.tableCards.length;

  for (let i = 0; i <= count; i++) {
    const slot = document.createElement("div");
    slot.className = "insertion-slot";
    slot.dataset.slotIndex = i;

    let slotText = "[ + ]";
    if (i === 0) slotText += "<span class='insertion-slot__label'>Antes</span>";
    else if (i === count) slotText += "<span class='insertion-slot__label'>Después</span>";
    else slotText += "<span class='insertion-slot__label'>Entre</span>";

    slot.innerHTML = slotText;
    slot.addEventListener("click", () => handleSlotClick(i));
    track.appendChild(slot);

    if (i < count) {
      const card = gameState.tableCards[i];
      const cardEl = document.createElement("div");
      cardEl.className = "timeline-card";

      cardEl.innerHTML = `
        <div class="timeline-card__year-badge">${card.year}</div>
        <div class="timeline-card__image-container">
          <img src="${card.image}" alt="${card.title}" class="timeline-card__image" onerror="this.src='https://via.placeholder.com/150x100?text=MuseumOfPlay'">
        </div>
        <div class="timeline-card__title">${card.title}</div>
      `;
      track.appendChild(cardEl);
    }
  }

  document.getElementById("kpiCardsInTable").textContent = count;
}

function renderTeamHand() {
  const grid = document.getElementById("teamHandGrid");
  grid.innerHTML = "";

  const hand = gameState.teamHands[gameState.userTeamId] || [];

  if (hand.length === 0) {
    grid.innerHTML = `<div style="color: var(--color-neon-green); font-family: var(--font-heading); padding: 1rem;">¡Mano vacía! Este equipo ha liberado todas sus cartas.</div>`;
    return;
  }

  hand.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "hand-card";
    if (gameState.selectedHandCardId === card.id) {
      cardEl.classList.add("hand-card--selected");
    }

    cardEl.innerHTML = `
      <div class="hand-card__image-box">
        <img src="${card.image}" alt="${card.title}" class="hand-card__image" onerror="this.src='https://via.placeholder.com/150x100?text=MuseumOfPlay'">
      </div>
      <div class="hand-card__title">${card.title}</div>
      <div class="hand-card__hidden-year">❓ FECHA OCULTA</div>
    `;

    cardEl.addEventListener("click", () => {
      gameState.selectedHandCardId = card.id;
      renderTeamHand();
    });

    grid.appendChild(cardEl);
  });
}

function handleSlotClick(slotIndex) {
  if (gameState.isGameOver) return;
  if (!gameState.selectedHandCardId) {
    alert("¡Selecciona primero una carta de tu mano antes de hacer clic en un slot [+]!");
    return;
  }

  const activeTeamIndex = gameState.currentTurnTeamIndex;
  const activeHand = gameState.teamHands[activeTeamIndex];
  const cardIndexInHand = activeHand.findIndex(c => c.id === gameState.selectedHandCardId);

  if (cardIndexInHand === -1) return;

  const cardToPlace = activeHand[cardIndexInHand];
  gameState.teamStats[activeTeamIndex].attempts++;

  const table = gameState.tableCards;
  const count = table.length;

  let isCorrect = false;
  if (slotIndex === 0) {
    isCorrect = cardToPlace.year <= table[0].year;
  } else if (slotIndex === count) {
    isCorrect = cardToPlace.year >= table[count - 1].year;
  } else {
    isCorrect = (table[slotIndex - 1].year <= cardToPlace.year) && (cardToPlace.year <= table[slotIndex].year);
  }

  if (isCorrect) {
    playSynthSound('success');
    launchConfetti();
    gameState.teamStats[activeTeamIndex].correct++;
    gameState.teamStreaks[activeTeamIndex]++;

    activeHand.splice(cardIndexInHand, 1);
    gameState.selectedHandCardId = null;

    gameState.tableCards.splice(slotIndex, 0, cardToPlace);
    triggerStreakOverlay(gameState.teamStreaks[activeTeamIndex]);

    addChatMessage("🤖 Sistema", `¡ACIERTO! ${ALL_TEAMS[activeTeamIndex].name} colocó '${cardToPlace.title}' (${cardToPlace.year}) correctamente.`);

  } else {
    playSynthSound('error');
    gameState.teamStats[activeTeamIndex].errors++;
    gameState.teamStreaks[activeTeamIndex] = 0;

    gameState.cardErrorTracker[cardToPlace.id] = (gameState.cardErrorTracker[cardToPlace.id] || 0) + 1;

    activeHand.splice(cardIndexInHand, 1);
    gameState.reserveDeck.push(cardToPlace);
    gameState.reserveDeck = shuffleArray(gameState.reserveDeck);

    if (gameState.reserveDeck.length > 0) {
      const newCard = gameState.reserveDeck.pop();
      activeHand.push(newCard);
    }

    gameState.selectedHandCardId = null;
    addChatMessage("🤖 Sistema", `❌ FALLO. ${ALL_TEAMS[activeTeamIndex].name} erró la fecha de '${cardToPlace.title}' (${cardToPlace.year}). La carta volvió al mazo y robaron una nueva.`);
  }

  renderTimelineTable();
  renderTeamHand();

  setTimeout(() => {
    const track = document.getElementById("timelineTrack");
    if (track) {
      const scrollPos = (slotIndex / (table.length + 1)) * track.scrollWidth;
      track.scrollTo({ left: scrollPos - 250, behavior: 'smooth' });
    }
  }, 100);

  checkEndGameOrAdvanceTurn();
}

function triggerStreakOverlay(streakCount) {
  const overlay = document.getElementById("streakOverlay");
  if (!overlay) return;

  let text = "";
  if (streakCount === 2) text = "🔥 DOBLE HIT";
  else if (streakCount === 3) text = "⚡ ¡¡TRIPLE HIT!!";
  else if (streakCount >= 4) text = "☠️ ¡¡MOOOONSTER KILL!!";
  else return;

  overlay.textContent = text;
  overlay.className = "streak-overlay streak-overlay--active";

  setTimeout(() => {
    overlay.className = "streak-overlay";
  }, 1800);
}

function checkEndGameOrAdvanceTurn() {
  const winningTeams = [];
  for (let t = 0; t < gameState.numTeams; t++) {
    if (gameState.teamHands[t].length === 0) {
      winningTeams.push(t);
    }
  }

  if (winningTeams.length > 0) {
    gameState.isGameOver = true;
    clearInterval(gameState.turnTimerInterval);

    let winnerText = "";
    if (winningTeams.length === 1) {
      const winner = ALL_TEAMS[winningTeams[0]];
      winnerText = `🏆 ¡${winner.name} HA GANADO LA PARTIDA!`;
      playSynthSound('victory');
    } else {
      winnerText = `⚖️ ¡EMPATE entre ${winningTeams.map(t => ALL_TEAMS[t].name).join(", ")}!`;
    }

    document.getElementById("diagTitle").textContent = winnerText;
    document.getElementById("modalDiagnostic").classList.add("modal-overlay--active");

    sendWebhookTelemetry();
  } else {
    advanceTurn();
  }
}

function advanceTurn() {
  gameState.currentTurnTeamIndex = (gameState.currentTurnTeamIndex + 1) % gameState.numTeams;
  updateHud();
  renderTeamHand();
  startTurnTimer();
}

function handleSendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const msgText = input.value.trim();
  if (!msgText) return;

  const sender = `${gameState.playerName ? gameState.playerName : 'Jugador'} (${ALL_TEAMS[gameState.userTeamId].name})`;
  addChatMessage(sender, msgText);
  input.value = "";
}

function addChatMessage(sender, text) {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  const msgEl = document.createElement("div");
  msgEl.className = "chat-msg";
  msgEl.innerHTML = `
    <span class="chat-msg__sender">${sender}:</span>
    <span>${text}</span>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function renderTeacherDashboard() {
  let totalAttempts = 0;
  let totalCorrect = 0;

  for (let t = 0; t < gameState.numTeams; t++) {
    totalAttempts += gameState.teamStats[t].attempts;
    totalCorrect += gameState.teamStats[t].correct;
  }

  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  document.getElementById("kpiAvgAccuracy").textContent = `${overallAccuracy}%`;
  document.getElementById("kpiActiveStudents").textContent = `${gameState.numTeams} Equipos`;

  const tbody = document.getElementById("leaderboardBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  for (let t = 0; t < gameState.numTeams; t++) {
    const team = ALL_TEAMS[t];
    const stats = gameState.teamStats[t];
    const handCount = gameState.teamHands[t].length;
    const eff = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="color: ${team.color};">${team.icon} ${team.name}</strong></td>
      <td style="font-family: var(--font-heading);">${handCount} cartas</td>
      <td style="font-family: var(--font-heading); color: var(--color-neon-cyan);">${eff}%</td>
      <td>
        <div class="progress-bar">
          <div class="progress-bar__fill--success" style="width: ${eff}%;"></div>
          <div class="progress-bar__fill--danger" style="width: ${100 - eff}%;"></div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }

  const hardestBody = document.getElementById("hardestCardsBody");
  if (!hardestBody) return;
  hardestBody.innerHTML = "";

  const hardestList = Object.keys(gameState.cardErrorTracker)
    .map(cardId => {
      const card = HISTORICAL_EVENTS.find(c => c.id === parseInt(cardId, 10));
      return { card, errors: gameState.cardErrorTracker[cardId] };
    })
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 5);

  if (hardestList.length === 0) {
    hardestBody.innerHTML = `<tr><td colspan="3" style="color: var(--color-text-muted); text-align: center;">Sin fallos registrados aún.</td></tr>`;
  } else {
    hardestList.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${item.card.title}</strong> (${item.card.year})</td>
        <td style="font-family: var(--font-heading); color: var(--color-neon-pink); font-weight: bold;">${item.errors} fallos</td>
        <td><span style="background: rgba(255, 0, 85, 0.2); color: var(--color-neon-pink); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">ALTA</span></td>
      `;
      hardestBody.appendChild(tr);
    });
  }
}

async function sendWebhookTelemetry() {
  if (!WEBHOOK_URL) return;
  const payload = {
    teamStats: gameState.teamStats,
    tableCardsCount: gameState.tableCards.length,
    cardErrors: gameState.cardErrorTracker,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn("Webhook no disponible.");
  }
}

function restartGame() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  openRoleSelectionModal();
}

function closeDiagnosticAndGoDashboard() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  switchView('teacher');
}
