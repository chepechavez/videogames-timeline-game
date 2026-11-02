/* ==========================================================================
   TIMELINE BOARD GAME - MULTIPLAYER CORE ENGINE WITH SUPABASE REALTIME & LOBBY
   Fiel a las mecánicas del juego de mesa con 74 Eventos e Imágenes Oficiales
   Fuente: The Strong National Museum of Play (museumofplay.org)
   ========================================================================== */

/* ==========================================================================
   🔑 SUPABASE CONFIGURATION - SALA ONLINE DE ALTA CAPACIDAD (500 ALUMNOS)
   ========================================================================== */
const SUPABASE_URL = "https://raqkwhuocjbqkhlyvbck.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhcWt3aHVvY2picWtobHl2YmNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMzE3NjgsImV4cCI6MjEwMTkwNzc2OH0.WfLSTllqjNSxTY5jyx0Y3ozmvkCx_iSg-3zvkfOQ4b0";

let supabaseClient = null;
let realtimeChannel = null;
let studentLobbyHeartbeatInterval = null;
let roomJoinVerifyTimeout = null;
let roomJoinRetryTimeout = null;
let isVerifyingRoomJoin = false;
let studentHasReceivedTeamAck = false;
let pendingTeamValidationConfirmCallback = null;
let pendingExitConfirmCallback = null;

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

// STATE MANAGEMENT WITH MONOTONIC VERSIONING (turnSequence)
let gameState = {
  myClientId: Math.random().toString(36).substring(2, 9),
  userRole: "teacher", // "teacher" or "student"
  gameMode: "projector", // "projector" or "online"
  configuredNumTeams: 4,
  numTeams: 4,
  initialCardsPerTeam: 4,
  
  playerName: "",
  userTeamId: 0,
  roomCode: "AULA-101",
  isRoomHostActive: false,
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
  teamTurnCounts: { 0: 0, 1: 0, 2: 0, 3: 0 },

  cardErrorTracker: {},
  currentTurnTeamIndex: 0,
  selectedHandCardId: null,
  
  // UNIFIED TURN TIMER & MONOTONIC VERSIONING
  turnSequence: 0,
  turnTimeLeft: 60,
  turnTimerInterval: null,
  turnStartTimeStamp: 0,
  lastTickedSecond: -1,
  turnTimesList: [],
  isMoveProcessing: false,
  
  uniqueCardsSeenIds: [],
  
  totalTurnsPlayed: 0,
  totalRoundsCompleted: 1,
  currentRoundTurnCount: 0,
  isTieBreakMode: false,
  tieBreakTeamIndices: [],
  
  teamStreaks: { 0: 0, 1: 0, 2: 0, 3: 0 },
  chatMessages: [],
  isGameOver: false,
  endedByTeacher: false,
  winnerTeamIndex: null,
  isTie: false,
  tiedWinnerIndices: [],
  isGameStarted: false
};

function incrementTurnSequence() {
  gameState.turnSequence = (gameState.turnSequence || 0) + 1;
}

function trackCardSeen(cardId) {
  if (!gameState.uniqueCardsSeenIds) gameState.uniqueCardsSeenIds = [];
  if (!gameState.uniqueCardsSeenIds.includes(cardId)) {
    gameState.uniqueCardsSeenIds.push(cardId);
  }
}

function getCardsPerTeamForCount(teamCount) {
  if (teamCount <= 2) return 6;
  if (teamCount === 3) return 5;
  return 4;
}

function usesAssignedRoster() {
  return gameState.gameMode === 'online' || Boolean(gameState.joinedStudents && gameState.joinedStudents.length > 0);
}

function getTeamMemberCount(teamIndex) {
  if (!gameState.joinedStudents) return 0;
  return gameState.joinedStudents.filter(s => s.teamId === teamIndex).length;
}

function isTeamEligibleToPlay(teamIndex) {
  const hand = gameState.teamHands[teamIndex] || [];
  if (hand.length === 0) return false;
  if (usesAssignedRoster()) {
    return getTeamMemberCount(teamIndex) > 0;
  }
  return true;
}

function analyzeTeamOccupancy(totalTeams, rosterList) {
  const occupiedTeamIndices = [];
  const emptyTeamIndices = [];
  for (let t = 0; t < totalTeams; t++) {
    const count = (rosterList || []).filter(s => s.teamId === t).length;
    if (count > 0) occupiedTeamIndices.push(t);
    else emptyTeamIndices.push(t);
  }
  return { occupiedTeamIndices, emptyTeamIndices };
}

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
   SUPABASE REALTIME SYNCHRONIZATION & ONLINE LOBBY ENGINE
   ========================================================================== */
function cleanupRealtimeChannel() {
  if (studentLobbyHeartbeatInterval) {
    clearInterval(studentLobbyHeartbeatInterval);
    studentLobbyHeartbeatInterval = null;
  }
  if (roomJoinVerifyTimeout) {
    clearTimeout(roomJoinVerifyTimeout);
    roomJoinVerifyTimeout = null;
  }
  if (roomJoinRetryTimeout) {
    clearTimeout(roomJoinRetryTimeout);
    roomJoinRetryTimeout = null;
  }
  isVerifyingRoomJoin = false;

  if (realtimeChannel && supabaseClient) {
    try {
      supabaseClient.removeChannel(realtimeChannel);
    } catch (e) {
      console.warn("Aviso al cerrar canal previo:", e);
    }
    realtimeChannel = null;
  }
}

function initSupabaseRealtime(onSubscribedCallback = null) {
  if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      if (!supabaseClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }

      if (realtimeChannel) {
        try {
          supabaseClient.removeChannel(realtimeChannel);
        } catch (err) {
          console.warn("Aviso removiendo canal anterior:", err);
        }
        realtimeChannel = null;
      }

      const roomChannelName = `timeline_room_${gameState.roomCode}`;
      realtimeChannel = supabaseClient.channel(roomChannelName);
      
      realtimeChannel
        .on('broadcast', { event: 'check_room_exists' }, payload => {
          if (payload.payload) {
            handleIncomingRoomCheck(payload.payload);
          }
        })
        .on('broadcast', { event: 'room_exists_ack' }, payload => {
          if (payload.payload) {
            handleIncomingRoomAck(payload.payload);
          }
        })
        .on('broadcast', { event: 'room_closed' }, payload => {
          if (payload.payload) {
            handleIncomingRoomClosed(payload.payload);
          }
        })
        .on('broadcast', { event: 'student_joined' }, payload => {
          if (payload.payload) {
            handleIncomingStudentJoin(payload.payload);
          }
        })
        .on('broadcast', { event: 'student_reconnected' }, payload => {
          if (payload.payload) {
            handleIncomingStudentReconnect(payload.payload);
          }
        })
        .on('broadcast', { event: 'student_left' }, payload => {
          if (payload.payload) {
            handleIncomingStudentLeft(payload.payload);
          }
        })
        .on('broadcast', { event: 'roster_sync' }, payload => {
          if (payload.payload) {
            handleIncomingRosterSync(payload.payload);
          }
        })
        .on('broadcast', { event: 'return_to_lobby' }, payload => {
          if (payload.payload) {
            handleIncomingReturnToLobby(payload.payload);
          }
        })
        .on('broadcast', { event: 'start_game' }, payload => {
          if (payload.payload) {
            handleIncomingStartGame(payload.payload);
          }
        })
        .on('broadcast', { event: 'game_sync' }, payload => {
          if (payload.payload && payload.senderId !== gameState.myClientId) {
            syncIncomingGameState(payload.payload);
          }
        })
        .on('broadcast', { event: 'chat_msg' }, payload => {
          if (payload.payload && payload.senderId !== gameState.myClientId) {
            addChatMessage(payload.payload.sender, payload.payload.text, false);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log("⚡ Supabase Realtime conectado a la sala:", roomChannelName);
            if (typeof onSubscribedCallback === 'function') {
              onSubscribedCallback();
            }
          }
        });
    } catch (e) {
      console.warn("Error al inicializar Supabase Realtime:", e);
    }
  }
}

function handleIncomingRoomCheck(data) {
  // Solo el profesor que creó y mantiene activa la sala responde a la verificación
  if (gameState.userRole !== 'teacher' || !gameState.isRoomHostActive || !realtimeChannel) return;
  if (!data || data.roomCode !== gameState.roomCode) return;

  const studentNameLower = (data.studentName || "").trim().toLowerCase();
  const isRegisteredStudent = studentNameLower.length > 0 &&
    gameState.joinedStudents.some(s => s.name.toLowerCase() === studentNameLower);

  realtimeChannel.send({
    type: 'broadcast',
    event: 'room_exists_ack',
    senderId: gameState.myClientId,
    payload: {
      roomCode: gameState.roomCode,
      targetClientId: data.clientId,
      isGameStarted: gameState.isGameStarted,
      isGameOver: gameState.isGameOver,
      isRegisteredStudent: isRegisteredStudent,
      numTeams: gameState.numTeams
    }
  });
}

function handleIncomingRoomAck(data) {
  if (gameState.userRole !== 'student' || !isVerifyingRoomJoin) return;
  if (data.targetClientId && data.targetClientId !== gameState.myClientId) return;
  if (data.roomCode !== gameState.roomCode) return;

  // Cancelar temporizadores de verificación: ¡La sala existe!
  if (roomJoinVerifyTimeout) {
    clearTimeout(roomJoinVerifyTimeout);
    roomJoinVerifyTimeout = null;
  }
  if (roomJoinRetryTimeout) {
    clearTimeout(roomJoinRetryTimeout);
    roomJoinRetryTimeout = null;
  }
  isVerifyingRoomJoin = false;
  resetStudentJoinButtonUI();

  // Si la partida está en curso y el estudiante NO estaba registrado en ella, bloquear entrada tardía
  if (data.isGameStarted && !data.isGameOver && !data.isRegisteredStudent) {
    playSynthSound('error');
    setStudentJoinStatus(
      `⚠️ La partida en la sala "${gameState.roomCode}" ya está en curso. Espera a que el profesor inicie una nueva sesión.`,
      "error"
    );
    cleanupRealtimeChannel();
    return;
  }

  // Si el estudiante ya estaba registrado y recargó/reingresó (en plena partida o en pantalla de resultados), reconectarlo
  if (data.isGameStarted && data.isRegisteredStudent) {
    setStudentJoinStatus("", "clear");
    if (realtimeChannel) {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'student_reconnected',
        senderId: gameState.myClientId,
        payload: {
          name: gameState.playerName,
          clientId: gameState.myClientId,
          roomCode: gameState.roomCode
        }
      });
    }
    return;
  }

  // Sala válida en Lobby de Espera: admitir al estudiante
  if (data.numTeams) gameState.numTeams = data.numTeams;
  setStudentJoinStatus("", "clear");
  playSynthSound('success');

  studentHasReceivedTeamAck = false;
  const studentPayload = {
    name: gameState.playerName,
    clientId: gameState.myClientId,
    roomCode: gameState.roomCode,
    needsTeamAck: true
  };

  closeAllModals();
  applyGameModeUI();

  document.getElementById("waitingStudentName").textContent = gameState.playerName;
  document.getElementById("waitingStudentTeam").textContent = "Asignando por el profesor...";
  document.getElementById("waitingStudentRoomCode").textContent = gameState.roomCode;
  document.getElementById("modalStudentWaiting").classList.add("modal-overlay--active");

  broadcastStudentJoined(studentPayload);

  // Heartbeat ligero en sala de espera para garantizar 100% de visibilidad ante micro-cortes WiFi
  if (studentLobbyHeartbeatInterval) clearInterval(studentLobbyHeartbeatInterval);
  studentLobbyHeartbeatInterval = setInterval(() => {
    if (gameState.userRole === 'student' && !gameState.isGameStarted && realtimeChannel) {
      broadcastStudentJoined({
        name: gameState.playerName,
        clientId: gameState.myClientId,
        roomCode: gameState.roomCode,
        needsTeamAck: !studentHasReceivedTeamAck
      });
    } else {
      clearInterval(studentLobbyHeartbeatInterval);
      studentLobbyHeartbeatInterval = null;
    }
  }, 4000);
}

function handleIncomingRoomClosed(data) {
  if (gameState.userRole !== 'student') return;
  if (data && data.roomCode && data.roomCode !== gameState.roomCode) return;

  if (!gameState.isGameStarted) {
    cleanupRealtimeChannel();
    closeAllModals();
    document.getElementById("modalStudentJoin").classList.add("modal-overlay--active");
    resetStudentJoinButtonUI();
    setStudentJoinStatus(
      `ℹ️ El profesor cerró o está reconfigurando la sala "${gameState.roomCode}". Espera a que la abra nuevamente para entrar.`,
      "info"
    );
    return;
  }

  // Si la partida ya estaba iniciada o finalizada y el profesor sale de la sala
  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }
  cleanupRealtimeChannel();

  if (!gameState.isGameOver) {
    const summary = computeCurrentStandingsOutcome();
    gameState.isGameOver = true;
    gameState.endedByTeacher = true;
    gameState.winnerTeamIndex = summary.winnerTeamIndex;
    gameState.isTie = summary.isTie;
    gameState.tiedWinnerIndices = summary.tiedWinnerIndices;
    updateHud();
    showGameOverModal(summary.winnerTeamIndex, summary.isTie, summary.tiedWinnerIndices);
  }

  const roomNote = document.getElementById("diagStudentRoomStatusNote");
  if (roomNote) {
    roomNote.style.display = "block";
    roomNote.textContent = "ℹ️ El profesor cerró la sala activa. Puedes seguir explorando los resultados o salir a la portada.";
  }
}

function handleIncomingStudentReconnect(studentData) {
  if (gameState.userRole !== 'teacher' || !gameState.isRoomHostActive || !gameState.isGameStarted) return;
  if (!studentData || !studentData.name || !realtimeChannel) return;

  const existing = gameState.joinedStudents.find(
    s => s.name.toLowerCase() === studentData.name.toLowerCase()
  );
  if (existing) {
    existing.clientId = studentData.clientId;
    realtimeChannel.send({
      type: 'broadcast',
      event: 'start_game',
      senderId: gameState.myClientId,
      payload: {
        ...buildGameSyncPayload(),
        targetClientId: studentData.clientId
      }
    });
  }
}

function broadcastStudentJoined(studentData) {
  if (realtimeChannel) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'student_joined',
      senderId: gameState.myClientId,
      payload: studentData
    });
  }
}

function handleIncomingStudentJoin(studentData) {
  if (gameState.userRole !== 'teacher' || !gameState.isRoomHostActive) return;
  if (gameState.isGameStarted && !gameState.isGameOver) return;
  if (!studentData || !studentData.name) return;

  const existingIndex = gameState.joinedStudents.findIndex(
    s => s.name.toLowerCase() === studentData.name.toLowerCase()
  );

  let rosterChanged = false;
  if (existingIndex === -1) {
    gameState.joinedStudents.push({
      name: studentData.name,
      clientId: studentData.clientId,
      teamId: gameState.joinedStudents.length % gameState.numTeams
    });
    rosterChanged = true;
  } else if (gameState.joinedStudents[existingIndex].clientId !== studentData.clientId) {
    gameState.joinedStudents[existingIndex].clientId = studentData.clientId;
    rosterChanged = true;
  }

  if (!gameState.isGameStarted) {
    gameState.joinedStudents.forEach((s, idx) => {
      s.teamId = idx % gameState.numTeams;
    });
  }

  if (rosterChanged) {
    renderTeacherOnlineLobbyGrid();
    renderTeacherDashboard();
    if (gameState.isGameOver) {
      const roomNote = document.getElementById("diagStudentRoomStatusNote");
      if (roomNote && gameState.gameMode === 'online' && realtimeChannel) {
        roomNote.textContent = `🟢 Sala ${gameState.roomCode} activa (${gameState.joinedStudents.length} estudiantes conectados para otra partida).`;
      }
    }
  }

  if (rosterChanged || studentData.needsTeamAck) {
    broadcastRosterSync();
  }
}

function handleIncomingStudentLeft(data) {
  if (gameState.userRole !== 'teacher' || !gameState.isRoomHostActive) return;
  if (!data) return;

  const leavingStudent = gameState.joinedStudents.find(s => {
    if (data.clientId && s.clientId) return s.clientId === data.clientId;
    if (data.name) return s.name.toLowerCase() === data.name.toLowerCase();
    return false;
  });

  const prevLen = gameState.joinedStudents.length;
  gameState.joinedStudents = gameState.joinedStudents.filter(s => {
    if (data.clientId && s.clientId) return s.clientId !== data.clientId;
    if (data.name) return s.name.toLowerCase() !== data.name.toLowerCase();
    return true;
  });

  if (gameState.joinedStudents.length === prevLen) return;

  if (!gameState.isGameStarted) {
    gameState.joinedStudents.forEach((s, idx) => {
      s.teamId = idx % gameState.numTeams;
    });
    renderTeacherOnlineLobbyGrid();
  }

  renderTeacherDashboard();
  broadcastRosterSync();

  if (gameState.isGameStarted && !gameState.isGameOver) {
    const departedTeamId = leavingStudent ? leavingStudent.teamId : null;
    const departedName = leavingStudent ? leavingStudent.name : (data.name || "Un estudiante");

    // Si todos los estudiantes abandonaron la sala en plena partida, finalizar limpiamente sin esperar reloj
    if (gameState.joinedStudents.length === 0) {
      addChatMessage("🤖 Sistema", `🚪 ${departedName} salió de la sala. No quedan estudiantes conectados; finalizando la partida automáticamente.`);
      finalizeMatchNoActiveStudents();
      return;
    }

    if (departedTeamId !== null && ALL_TEAMS[departedTeamId]) {
      const remainingInTeam = getTeamMemberCount(departedTeamId);
      if (remainingInTeam === 0) {
        addChatMessage(
          "🤖 Sistema",
          `🚪 ${departedName} salió de la sala. ⚠️ ${ALL_TEAMS[departedTeamId].name} quedó sin integrantes conectados; sus turnos se omitirán automáticamente.`
        );

        // Si justo era el turno del equipo que quedó vacío, pasar el turno de inmediato en 0s
        if (gameState.currentTurnTeamIndex === departedTeamId && !gameState.isMoveProcessing) {
          gameState.isMoveProcessing = true;
          if (gameState.turnTimerInterval) {
            clearInterval(gameState.turnTimerInterval);
            gameState.turnTimerInterval = null;
          }
          gameState.selectedHandCardId = null;
          gameState.currentRoundTurnCount++;
          advanceTurnOrEvaluateRound();
          return;
        }
      } else {
        // El equipo aún tiene integrantes; si era su turno activo, refrescar reloj para el compañero que asume el tiro
        if (gameState.currentTurnTeamIndex === departedTeamId && !gameState.isMoveProcessing) {
          gameState.turnStartTimeStamp = Date.now();
          incrementTurnSequence();
          updateHud();
          startTurnTimer();
          addChatMessage(
            "🤖 Sistema",
            `🚪 ${departedName} salió de la sala. El turno activo de ${ALL_TEAMS[departedTeamId].name} pasa a ${getActiveRepresentativeName()}.`
          );
          broadcastGameState();
          return;
        } else {
          addChatMessage("🤖 Sistema", `🚪 ${departedName} salió de la sala.`);
        }
      }
    }

    updateHud();
  }

  if (gameState.isGameOver) {
    const roomNote = document.getElementById("diagStudentRoomStatusNote");
    if (roomNote && gameState.gameMode === 'online' && realtimeChannel) {
      roomNote.textContent = `🟢 Sala ${gameState.roomCode} activa (${gameState.joinedStudents.length} estudiantes conectados para otra partida).`;
    }
  }
}

function broadcastRosterSync() {
  if (realtimeChannel && gameState.userRole === 'teacher') {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'roster_sync',
      senderId: gameState.myClientId,
      payload: {
        joinedStudents: gameState.joinedStudents,
        numTeams: gameState.numTeams
      }
    });
  }
}

function syncMyAssignedTeamFromRoster() {
  if (gameState.userRole !== 'student') return;
  const myInfo = gameState.joinedStudents.find(s =>
    (gameState.playerName && s.name.toLowerCase() === gameState.playerName.toLowerCase()) ||
    (s.clientId && s.clientId === gameState.myClientId)
  );
  if (myInfo) {
    gameState.userTeamId = myInfo.teamId;
    studentHasReceivedTeamAck = true;
    const waitingTeamEl = document.getElementById("waitingStudentTeam");
    if (waitingTeamEl && ALL_TEAMS[myInfo.teamId]) {
      waitingTeamEl.textContent = `${ALL_TEAMS[myInfo.teamId].icon} ${ALL_TEAMS[myInfo.teamId].name}`;
    }
  }
}

function handleIncomingRosterSync(data) {
  if (data && data.joinedStudents) {
    gameState.joinedStudents = data.joinedStudents;
    if (data.numTeams) gameState.numTeams = data.numTeams;
    syncMyAssignedTeamFromRoster();
    if (gameState.isGameStarted) {
      applyGameModeUI();
      updateHud();
      renderTeacherDashboard();
    }
  }
}

function handleIncomingReturnToLobby(data) {
  if (gameState.userRole !== 'student') return;
  if (data && data.roomCode && data.roomCode !== gameState.roomCode) return;

  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }

  gameState.isGameStarted = false;
  gameState.isGameOver = false;
  gameState.endedByTeacher = false;
  gameState.isMoveProcessing = false;
  gameState.selectedHandCardId = null;

  if (data && data.numTeams) gameState.numTeams = data.numTeams;
  if (data && data.joinedStudents) gameState.joinedStudents = data.joinedStudents;
  syncMyAssignedTeamFromRoster();

  closeAllModals();
  applyGameModeUI();
  const waitingNameEl = document.getElementById("waitingStudentName");
  if (waitingNameEl) waitingNameEl.textContent = gameState.playerName;
  const waitingRoomEl = document.getElementById("waitingStudentRoomCode");
  if (waitingRoomEl) waitingRoomEl.textContent = gameState.roomCode;
  document.getElementById("modalStudentWaiting").classList.add("modal-overlay--active");
}

function buildGameSyncPayload() {
  return {
    reserveDeck: gameState.reserveDeck,
    tableCards: gameState.tableCards,
    teamHands: gameState.teamHands,
    teamStats: gameState.teamStats,
    teamStreaks: gameState.teamStreaks,
    teamTurnCounts: gameState.teamTurnCounts,
    cardErrorTracker: gameState.cardErrorTracker,
    currentTurnTeamIndex: gameState.currentTurnTeamIndex,
    totalTurnsPlayed: gameState.totalTurnsPlayed,
    totalRoundsCompleted: gameState.totalRoundsCompleted,
    currentRoundTurnCount: gameState.currentRoundTurnCount,
    isTieBreakMode: gameState.isTieBreakMode,
    tieBreakTeamIndices: gameState.tieBreakTeamIndices,
    joinedStudents: gameState.joinedStudents,
    numTeams: gameState.numTeams,
    initialCardsPerTeam: gameState.initialCardsPerTeam,
    turnStartTimeStamp: gameState.turnStartTimeStamp,
    turnTimesList: gameState.turnTimesList,
    uniqueCardsSeenIds: gameState.uniqueCardsSeenIds,
    isGameStarted: gameState.isGameStarted,
    isGameOver: gameState.isGameOver,
    endedByTeacher: gameState.endedByTeacher,
    winnerTeamIndex: gameState.winnerTeamIndex,
    isTie: gameState.isTie,
    tiedWinnerIndices: gameState.tiedWinnerIndices,
    turnSequence: gameState.turnSequence
  };
}

function applyIncomingGamePayload(data, isInitialStart = false) {
  if (data.reserveDeck) gameState.reserveDeck = data.reserveDeck;
  if (data.tableCards) gameState.tableCards = data.tableCards;
  if (data.teamHands) gameState.teamHands = data.teamHands;
  if (data.teamStats) gameState.teamStats = data.teamStats;
  if (data.teamStreaks) gameState.teamStreaks = data.teamStreaks;
  if (data.teamTurnCounts) gameState.teamTurnCounts = data.teamTurnCounts;
  if (data.cardErrorTracker) gameState.cardErrorTracker = data.cardErrorTracker;
  const previousTurnTeam = gameState.currentTurnTeamIndex;
  if (data.currentTurnTeamIndex !== undefined) gameState.currentTurnTeamIndex = data.currentTurnTeamIndex;
  if (data.totalTurnsPlayed !== undefined) gameState.totalTurnsPlayed = data.totalTurnsPlayed;
  if (data.totalRoundsCompleted !== undefined) gameState.totalRoundsCompleted = data.totalRoundsCompleted;
  if (data.currentRoundTurnCount !== undefined) gameState.currentRoundTurnCount = data.currentRoundTurnCount;
  if (data.isTieBreakMode !== undefined) gameState.isTieBreakMode = data.isTieBreakMode;
  if (data.tieBreakTeamIndices) gameState.tieBreakTeamIndices = data.tieBreakTeamIndices;
  if (data.joinedStudents) gameState.joinedStudents = data.joinedStudents;
  if (data.numTeams) gameState.numTeams = data.numTeams;
  if (data.initialCardsPerTeam) gameState.initialCardsPerTeam = data.initialCardsPerTeam;
  if (data.turnStartTimeStamp) gameState.turnStartTimeStamp = data.turnStartTimeStamp;
  if (data.turnTimesList) gameState.turnTimesList = data.turnTimesList;
  if (data.uniqueCardsSeenIds) gameState.uniqueCardsSeenIds = data.uniqueCardsSeenIds;
  if (data.endedByTeacher !== undefined) gameState.endedByTeacher = Boolean(data.endedByTeacher);
  if (data.tiedWinnerIndices) gameState.tiedWinnerIndices = data.tiedWinnerIndices;
  if (data.turnSequence !== undefined) gameState.turnSequence = data.turnSequence;

  if (isInitialStart || previousTurnTeam !== gameState.currentTurnTeamIndex) {
    gameState.selectedHandCardId = null;
  }

  syncMyAssignedTeamFromRoster();
}

function openTeamValidationModal({
  icon = "⚠️",
  title = "HAY EQUIPOS SIN ESTUDIANTES",
  message = "",
  summaryHtml = "",
  waitLabel = "⏳ Esperar Estudiantes",
  confirmLabel = null,
  onConfirm = null
}) {
  const modal = document.getElementById("modalTeamValidation");
  if (!modal) return;

  const iconEl = document.getElementById("teamValidationIcon");
  const titleEl = document.getElementById("teamValidationTitle");
  const msgEl = document.getElementById("teamValidationMessage");
  const summaryEl = document.getElementById("teamValidationSummary");
  const waitBtn = document.getElementById("teamValidationWaitBtn");
  const confirmBtn = document.getElementById("teamValidationConfirmBtn");

  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  if (summaryEl) {
    if (summaryHtml) {
      summaryEl.innerHTML = summaryHtml;
      summaryEl.style.display = "block";
    } else {
      summaryEl.innerHTML = "";
      summaryEl.style.display = "none";
    }
  }

  if (waitBtn) waitBtn.textContent = waitLabel;

  pendingTeamValidationConfirmCallback = typeof onConfirm === "function" ? onConfirm : null;
  if (confirmBtn) {
    if (confirmLabel && pendingTeamValidationConfirmCallback) {
      confirmBtn.textContent = confirmLabel;
      confirmBtn.style.display = "inline-block";
    } else {
      confirmBtn.style.display = "none";
    }
  }

  modal.classList.add("modal-overlay--active");
}

function closeTeamValidationModal() {
  pendingTeamValidationConfirmCallback = null;
  const modal = document.getElementById("modalTeamValidation");
  if (modal) modal.classList.remove("modal-overlay--active");
}

function confirmTeamValidationAction() {
  const callback = pendingTeamValidationConfirmCallback;
  closeTeamValidationModal();
  if (typeof callback === "function") {
    callback();
  }
}

function compactOnlineTeamsToOccupied() {
  const { occupiedTeamIndices } = analyzeTeamOccupancy(gameState.numTeams, gameState.joinedStudents);
  if (occupiedTeamIndices.length >= 2) {
    const remap = {};
    occupiedTeamIndices.forEach((oldTeamId, newIdx) => {
      remap[oldTeamId] = newIdx;
    });
    gameState.joinedStudents.forEach((s, idx) => {
      s.teamId = remap[s.teamId] !== undefined ? remap[s.teamId] : (idx % occupiedTeamIndices.length);
    });
    gameState.numTeams = occupiedTeamIndices.length;
  } else {
    // Si 2+ estudiantes quedaron agrupados en un mismo equipo tras salidas post-partida, dividirlos en 2 equipos activos
    gameState.numTeams = 2;
    gameState.joinedStudents.forEach((s, idx) => {
      s.teamId = idx % 2;
    });
  }
  gameState.initialCardsPerTeam = getCardsPerTeamForCount(gameState.numTeams);
}

function executeOnlineMatchStart() {
  gameState.isGameStarted = true;
  gameState.isGameOver = false;
  gameState.endedByTeacher = false;
  gameState.winnerTeamIndex = null;
  gameState.isTie = false;
  gameState.tiedWinnerIndices = [];
  switchView('student');
  applyGameModeUI();
  initNewGame(false);
  closeAllModals();

  if (realtimeChannel) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'start_game',
      senderId: gameState.myClientId,
      payload: buildGameSyncPayload()
    });
  }
}

function confirmStartOnlineWithDynamicTeams() {
  if (gameState.joinedStudents.length < 2) {
    // Por si algún estudiante salió mientras el modal estaba abierto
    teacherStartMatchForAllStudents();
    return;
  }
  const { emptyTeamIndices } = analyzeTeamOccupancy(gameState.numTeams, gameState.joinedStudents);
  if (emptyTeamIndices.length > 0) {
    compactOnlineTeamsToOccupied();
  }
  executeOnlineMatchStart();
}

function teacherReopenOnlineWaitingLobby() {
  if (gameState.userRole !== 'teacher' || gameState.gameMode !== 'online') return;
  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }

  gameState.numTeams = gameState.configuredNumTeams || 4;
  gameState.initialCardsPerTeam = getCardsPerTeamForCount(gameState.numTeams);
  gameState.isGameStarted = false;
  gameState.isGameOver = false;
  gameState.endedByTeacher = false;
  gameState.joinedStudents.forEach((s, idx) => {
    s.teamId = idx % gameState.numTeams;
  });

  closeAllModals();
  applyGameModeUI();
  document.getElementById("lobbyRoomCodeTitle").textContent = `SALA: ${gameState.roomCode}`;
  document.getElementById("modalOnlineLobby").classList.add("modal-overlay--active");
  renderTeacherOnlineLobbyGrid();
  renderTeacherDashboard();
  broadcastRosterSync();

  if (realtimeChannel) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'return_to_lobby',
      senderId: gameState.myClientId,
      payload: {
        roomCode: gameState.roomCode,
        numTeams: gameState.numTeams,
        joinedStudents: gameState.joinedStudents
      }
    });
  }
}

function teacherStartMatchForAllStudents(isRematch = false) {
  const connectedCount = gameState.joinedStudents.length;

  // 1. Validar mínimo 2 estudiantes conectados para partidas online
  if (connectedCount < 2) {
    playSynthSound('error');
    if (isRematch) {
      openTeamValidationModal({
        icon: "⏳",
        title: "SE REQUIEREN MÍNIMO 2 ESTUDIANTES",
        message: connectedCount === 0
          ? `Ya no quedan estudiantes conectados en la sala "${gameState.roomCode}". Puedes abrir la sala de espera para que ingresen nuevos jugadores.`
          : `Actualmente solo queda 1 estudiante conectado (${gameState.joinedStudents[0].name}). Se necesitan mínimo 2 estudiantes para iniciar una nueva partida.`,
        summaryHtml: `• <strong>Sala activa:</strong> ${gameState.roomCode}<br>• <strong>Conectados ahora:</strong> ${connectedCount} de mínimo 2 requeridos.`,
        waitLabel: "◀ Volver a Resultados",
        confirmLabel: "👥 Abrir Sala de Espera",
        onConfirm: () => teacherReopenOnlineWaitingLobby()
      });
    } else {
      openTeamValidationModal({
        icon: "⏳",
        title: connectedCount === 0 ? "AÚN NO HAY ESTUDIANTES CONECTADOS" : "SE REQUIEREN MÍNIMO 2 ESTUDIANTES",
        message: connectedCount === 0
          ? `Todavía no ha entrado ningún estudiante a la sala "${gameState.roomCode}". Espera a que se conecten al menos 2 estudiantes para iniciar.`
          : `Actualmente solo hay 1 estudiante conectado (${gameState.joinedStudents[0].name}). Espera a que ingrese al menos otro estudiante para formar equipos.`,
        summaryHtml: `• <strong>Sala en espera:</strong> ${gameState.roomCode}<br>• <strong>Conectados ahora:</strong> ${connectedCount} de mínimo 2 requeridos.`,
        waitLabel: "⏳ Seguir Esperando en el Lobby",
        confirmLabel: null
      });
    }
    return;
  }

  // 2. Verificar si existen equipos vacíos (ej. 4 equipos creados y 3 estudiantes, o 3 equipos y 2 estudiantes)
  const { occupiedTeamIndices, emptyTeamIndices } = analyzeTeamOccupancy(gameState.numTeams, gameState.joinedStudents);
  if (emptyTeamIndices.length > 0) {
    const targetTeams = occupiedTeamIndices.length >= 2 ? occupiedTeamIndices.length : 2;
    const targetCards = getCardsPerTeamForCount(targetTeams);
    const emptyNames = emptyTeamIndices.map(idx => `${ALL_TEAMS[idx].icon} ${ALL_TEAMS[idx].name}`).join(", ");

    openTeamValidationModal({
      icon: "⚠️",
      title: "HAY EQUIPOS SIN ESTUDIANTES",
      message: `Hay ${gameState.numTeams} equipos configurados, pero solo ${connectedCount} estudiantes conectados. ¿Deseas esperar a quienes faltan o iniciar ahora reduciendo automáticamente los equipos activos para evitar turnos vacíos?`,
      summaryHtml: `• <strong>${emptyTeamIndices.length === 1 ? "Equipo vacío detectado" : "Equipos vacíos detectados"}:</strong> ${emptyNames}<br>• <strong>Si inicias ahora:</strong> Se reducirá automáticamente a <strong>${targetTeams} equipos activos</strong> (${targetCards} cartas por equipo).`,
      waitLabel: "⏳ Esperar Estudiantes",
      confirmLabel: `🚀 Iniciar con ${targetTeams} Equipos`,
      onConfirm: () => confirmStartOnlineWithDynamicTeams()
    });
    return;
  }

  // 3. Todos los equipos tienen integrantes: iniciar de inmediato
  executeOnlineMatchStart();
}

function handleIncomingStartGame(data) {
  if (!data) return;
  if (data.targetClientId && data.targetClientId !== gameState.myClientId) return;

  if (studentLobbyHeartbeatInterval) {
    clearInterval(studentLobbyHeartbeatInterval);
    studentLobbyHeartbeatInterval = null;
  }

  gameState.isGameStarted = true;
  gameState.isGameOver = Boolean(data.isGameOver);
  gameState.endedByTeacher = Boolean(data.endedByTeacher);
  gameState.winnerTeamIndex = data.winnerTeamIndex !== undefined ? data.winnerTeamIndex : null;
  gameState.isTie = Boolean(data.isTie);
  gameState.tiedWinnerIndices = data.tiedWinnerIndices || [];
  gameState.isMoveProcessing = false;

  applyIncomingGamePayload(data, true);

  closeAllModals();
  switchView('student');
  applyGameModeUI();
  updateHud();
  renderTimelineTable();
  renderTeamHand();
  renderTeacherDashboard();
  if (!gameState.isGameOver) {
    resetChatMessagesBox();
    startTurnTimer();
    playSynthSound('victory');
    launchConfetti();
  } else {
    showGameOverModal(gameState.winnerTeamIndex, gameState.isTie, gameState.tiedWinnerIndices);
  }
}

function broadcastGameState() {
  if (realtimeChannel && gameState.isGameStarted) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'game_sync',
      senderId: gameState.myClientId,
      payload: buildGameSyncPayload()
    });
  }
}

function broadcastChatMessage(sender, text) {
  if (realtimeChannel) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'chat_msg',
      senderId: gameState.myClientId,
      payload: { sender, text }
    });
  }
}

function syncIncomingGameState(data) {
  if (!data) return;

  // FILTRADO ESTRICTO DE SECUENCIA MONOTÓNICA: DESCARTAR PAQUETES DUPLICADOS O DESACTUALIZADOS
  if (data.turnSequence !== undefined) {
    if (data.turnSequence <= gameState.turnSequence) {
      console.log(`⚠️ Ignorando broadcast duplicado/desactualizado (secuencia ${data.turnSequence} <= ${gameState.turnSequence})`);
      return;
    }
  }

  const wasGameOver = gameState.isGameOver;
  applyIncomingGamePayload(data, false);

  if (data.isGameOver && !wasGameOver) {
    gameState.isGameOver = true;
    gameState.winnerTeamIndex = data.winnerTeamIndex;
    gameState.isTie = data.isTie;
    clearInterval(gameState.turnTimerInterval);
    const tiedList = (data.tiedWinnerIndices && data.tiedWinnerIndices.length > 0)
      ? data.tiedWinnerIndices
      : (data.tieBreakTeamIndices || []);
    showGameOverModal(data.winnerTeamIndex, data.isTie, tiedList);
  }

  gameState.isMoveProcessing = false;
  applyGameModeUI();
  updateHud();
  renderTimelineTable();
  renderTeamHand();
  renderTeacherDashboard();
  if (!gameState.isGameOver) {
    startTurnTimer();
  }
}

/* ==========================================================================
   INITIALIZATION & ROLE SELECTION FLOW
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  applyGameModeUI();
  renderTeacherDashboard();
  setInterval(renderTeacherDashboard, 3000);
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
    if (tabTeacherBtn) tabTeacherBtn.className = "app-header__tab-btn";
  } else {
    teacherView.classList.add("view-section--active");
    studentView.classList.remove("view-section--active");
    tabStudentBtn.className = "app-header__tab-btn";
    if (tabTeacherBtn) tabTeacherBtn.className = "app-header__tab-btn app-header__tab-btn--active-teacher";
    renderTeacherDashboard();
  }
}

function terminateActiveSessionIfNeeded() {
  // Si el profesor cierra una sala activa (en espera, en partida o post-partida), notificar a los alumnos
  if (gameState.userRole === 'teacher' && gameState.isRoomHostActive && realtimeChannel) {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'room_closed',
      senderId: gameState.myClientId,
      payload: { roomCode: gameState.roomCode }
    });
  } else if (gameState.userRole === 'student' && realtimeChannel) {
    // Si un estudiante sale voluntariamente a la portada, notificar a la sala para actualizar integrantes
    realtimeChannel.send({
      type: 'broadcast',
      event: 'student_left',
      senderId: gameState.myClientId,
      payload: {
        clientId: gameState.myClientId,
        name: gameState.playerName,
        roomCode: gameState.roomCode
      }
    });
  }

  gameState.isRoomHostActive = false;
  gameState.isGameStarted = false;
  gameState.isGameOver = false;
  gameState.isMoveProcessing = false;
  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }

  cleanupRealtimeChannel();
  resetStudentJoinButtonUI();
  setStudentJoinStatus("", "clear");
  updatePostGameAndTeacherButtons();
  renderTeacherDashboard();
}

function openConfirmExitModal({
  icon = "⚠️",
  title = "¿SALIR A LA PORTADA?",
  message = "",
  cancelLabel = "◀ No, quedarme aquí",
  confirmLabel = "🏠 Sí, Salir a Portada",
  onConfirm = null
}) {
  const modal = document.getElementById("modalConfirmExit");
  if (!modal) {
    if (typeof onConfirm === "function") onConfirm();
    return;
  }

  const iconEl = document.getElementById("confirmExitIcon");
  const titleEl = document.getElementById("confirmExitTitle");
  const msgEl = document.getElementById("confirmExitMessage");
  const cancelBtn = document.getElementById("confirmExitCancelBtn");
  const proceedBtn = document.getElementById("confirmExitProceedBtn");

  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (cancelBtn) cancelBtn.textContent = cancelLabel;
  if (proceedBtn) proceedBtn.textContent = confirmLabel;

  pendingExitConfirmCallback = typeof onConfirm === "function" ? onConfirm : null;
  modal.classList.add("modal-overlay--active");
}

function closeConfirmExitModal() {
  pendingExitConfirmCallback = null;
  const modal = document.getElementById("modalConfirmExit");
  if (modal) modal.classList.remove("modal-overlay--active");
}

function confirmExitAction() {
  const callback = pendingExitConfirmCallback;
  closeConfirmExitModal();
  if (typeof callback === "function") {
    callback();
  }
}

function requestExitToCover() {
  if (!gameState.isGameStarted && !gameState.isRoomHostActive) {
    openRoleSelectionModal();
    return;
  }

  let message = "";
  if (gameState.userRole === 'teacher') {
    if (gameState.isGameOver) {
      message = (gameState.gameMode === 'online' && gameState.isRoomHostActive)
        ? `Si sales a la portada ahora, se cerrará definitivamente la sala "${gameState.roomCode}" para los estudiantes conectados y ya no podrás regresar a estos resultados ni seguir explorando la línea de tiempo armada.`
        : "Si sales a la portada ahora, se cerrará la sesión actual y ya no podrás regresar a estos resultados, métricas ni seguir explorando la línea de tiempo armada.";
    } else {
      message = (gameState.gameMode === 'online' && gameState.isRoomHostActive)
        ? `La partida en la sala "${gameState.roomCode}" sigue en curso. Si sales a la portada, se cerrará la sala para todos los estudiantes y no podrás regresar.`
        : "La partida sigue en curso. Si sales a la portada, perderás el progreso actual y no podrás regresar.";
    }
  } else {
    if (gameState.isGameOver) {
      message = (gameState.gameMode === 'online' && realtimeChannel)
        ? `Si sales a la portada ahora, abandonarás la sala "${gameState.roomCode}" y ya no podrás regresar a ver estos resultados ni terminar de explorar la línea de tiempo armada (tampoco entrarás automáticamente si el profesor inicia otra ronda).`
        : "Si sales a la portada ahora, ya no podrás regresar a ver estos resultados ni terminar de explorar la línea de tiempo armada.";
    } else {
      message = `La partida en la sala "${gameState.roomCode}" aún está en curso. Si sales a la portada, abandonarás a tu equipo y ya no podrás regresar a esta sesión.`;
    }
  }

  openConfirmExitModal({
    icon: "⚠️",
    title: "¿SALIR A LA PORTADA?",
    message,
    cancelLabel: "◀ No, quedarme aquí",
    confirmLabel: "🏠 Sí, Salir a Portada",
    onConfirm: () => openRoleSelectionModal()
  });
}

function executeExitToTeacherConfig() {
  terminateActiveSessionIfNeeded();
  gameState.userRole = "teacher";

  const modeSelect = document.getElementById("selectGameModeSetting");
  if (modeSelect && gameState.gameMode) {
    modeSelect.value = gameState.gameMode;
  }
  const teamsSelect = document.getElementById("selectNumTeamsSetting");
  if (teamsSelect && gameState.configuredNumTeams) {
    teamsSelect.value = String(gameState.configuredNumTeams);
  }
  const roomInput = document.getElementById("inputTeacherRoomCode");
  if (roomInput && gameState.roomCode) {
    roomInput.value = gameState.roomCode;
  }

  applyGameModeUI();
  closeAllModals();
  document.getElementById("modalTeacherConfig").classList.add("modal-overlay--active");
  toggleTeacherModeFields();
}

function requestTeacherChangeMode() {
  if (!gameState.isGameStarted && !gameState.isRoomHostActive) {
    executeExitToTeacherConfig();
    return;
  }

  let message = "";
  if (gameState.gameMode === 'online' && gameState.isRoomHostActive) {
    message = gameState.isGameOver
      ? `Si pasas a configurar una nueva partida o cambiar de modo, se cerrará la sala actual "${gameState.roomCode}" para los estudiantes conectados y ya no podrás volver a esta línea de tiempo ni a sus resultados.`
      : `La partida en la sala "${gameState.roomCode}" sigue en curso. Si pasas a configurar una nueva partida o cambiar de modo, se cerrará la sala actual para todos los estudiantes y no podrás regresar.`;
  } else {
    message = gameState.isGameOver
      ? "Si pasas a configurar una nueva partida o cambiar de modo, se cerrará la sesión actual y ya no podrás regresar a explorar esta línea de tiempo ni ver sus resultados."
      : "La partida actual sigue en curso. Si pasas a configurar una nueva partida o cambiar de modo, se descartará el progreso actual y no podrás regresar.";
  }

  openConfirmExitModal({
    icon: "⚙️",
    title: "¿CAMBIAR MODO / CREAR PARTIDA?",
    message,
    cancelLabel: "◀ No, quedarme aquí",
    confirmLabel: "⚙️ Sí, Ir a Configuración",
    onConfirm: () => executeExitToTeacherConfig()
  });
}

function requestLobbyBackToConfig() {
  if (gameState.isRoomHostActive && gameState.joinedStudents && gameState.joinedStudents.length > 0) {
    openConfirmExitModal({
      icon: "⚠️",
      title: "¿CERRAR SALA DE ESPERA?",
      message: `Hay ${gameState.joinedStudents.length} estudiante(s) conectado(s) en la sala "${gameState.roomCode}". Si vuelves a la configuración, se cerrará la sala actual y deberán unirse nuevamente cuando la abras.`,
      cancelLabel: "◀ Seguir en el Lobby",
      confirmLabel: "⚙️ Sí, Cambiar Configuración",
      onConfirm: () => executeExitToTeacherConfig()
    });
    return;
  }
  executeExitToTeacherConfig();
}

function openRoleSelectionModal() {
  terminateActiveSessionIfNeeded();
  closeAllModals();
  document.getElementById("modalRoleSelection").classList.add("modal-overlay--active");
}

function closeAllModals() {
  pendingTeamValidationConfirmCallback = null;
  pendingExitConfirmCallback = null;
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("modal-overlay--active"));
}

function selectInitialRole(role) {
  gameState.userRole = role;
  applyGameModeUI();
  closeAllModals();
  if (role === 'teacher') {
    document.getElementById("modalTeacherConfig").classList.add("modal-overlay--active");
    toggleTeacherModeFields();
  } else {
    resetStudentJoinButtonUI();
    setStudentJoinStatus("", "clear");
    document.getElementById("modalStudentJoin").classList.add("modal-overlay--active");
  }
}

function toggleTeacherModeFields() {
  const mode = document.getElementById("selectGameModeSetting").value;
  const studentListGroup = document.getElementById("teacherStudentListGroup");
  const roomCodeGroup = document.getElementById("teacherRoomCodeGroup");
  const btnSubmit = document.getElementById("btnTeacherConfigSubmit");

  if (mode === 'projector') {
    studentListGroup.style.display = "flex";
    roomCodeGroup.style.display = "none";
    if (btnSubmit) btnSubmit.textContent = "🚀 ¡INICIAR PARTIDA DE CLASE!";
  } else {
    studentListGroup.style.display = "none";
    roomCodeGroup.style.display = "flex";
    if (btnSubmit) btnSubmit.textContent = "🚀 ¡ABRIR SALA DE ESPERA ONLINE!";
  }
}

function launchProjectorMatch(effectiveTeams, names) {
  gameState.userRole = "teacher";
  gameState.playerName = "";
  gameState.gameMode = "projector";
  gameState.isRoomHostActive = false;
  gameState.numTeams = effectiveTeams;
  gameState.initialCardsPerTeam = getCardsPerTeamForCount(effectiveTeams);
  gameState.joinedStudents = [];
  cleanupRealtimeChannel();

  if (names && names.length > 0) {
    names.forEach((name, idx) => {
      const teamId = idx % effectiveTeams;
      gameState.joinedStudents.push({ name, teamId });
    });
  }

  closeAllModals();
  switchView('student');
  applyGameModeUI();
  gameState.isGameStarted = true;
  initNewGame(false);
}

function handleTeacherSubmitConfig(e) {
  e.preventDefault();
  const mode = document.getElementById("selectGameModeSetting").value;
  const numTeams = parseInt(document.getElementById("selectNumTeamsSetting").value, 10);

  gameState.configuredNumTeams = numTeams;

  if (mode === 'projector') {
    const rawList = document.getElementById("textareaStudentList").value.trim();
    const names = rawList
      ? rawList.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0)
      : [];

    // Si el profesor escribió nombres pero ingresó solo 1 estudiante, pedir mínimo 2 o dejar vacío
    if (names.length === 1) {
      playSynthSound('error');
      openTeamValidationModal({
        icon: "⚠️",
        title: "SE REQUIEREN MÍNIMO 2 ESTUDIANTES",
        message: `Ingresaste solo 1 estudiante (${names[0]}) en la lista. Agrega al menos 2 nombres para formar equipos o deja la lista vacía para jugar por grupos libres en el salón.`,
        summaryHtml: `• <strong>Estudiantes en lista:</strong> 1 (mínimo requerido: 2 si usas lista de nombres).`,
        waitLabel: "✏️ Editar Lista de Estudiantes",
        confirmLabel: null
      });
      return;
    }

    // Si ingresó menos estudiantes que equipos configurados (ej. 4 equipos y 3 estudiantes, o 3 equipos y 2 estudiantes)
    if (names.length >= 2 && names.length < numTeams) {
      const targetTeams = names.length;
      const targetCards = getCardsPerTeamForCount(targetTeams);
      const emptyTeamNames = [];
      for (let t = targetTeams; t < numTeams; t++) {
        emptyTeamNames.push(`${ALL_TEAMS[t].icon} ${ALL_TEAMS[t].name}`);
      }

      openTeamValidationModal({
        icon: "⚠️",
        title: "HAY EQUIPOS SIN ESTUDIANTES",
        message: `Seleccionaste ${numTeams} equipos, pero ingresaste solo ${names.length} estudiantes en la lista. ¿Deseas volver para agregar quienes faltan o iniciar ahora reduciendo automáticamente los equipos activos?`,
        summaryHtml: `• <strong>${emptyTeamNames.length === 1 ? "Equipo vacío detectado" : "Equipos vacíos detectados"}:</strong> ${emptyTeamNames.join(", ")}<br>• <strong>Si inicias ahora:</strong> Se reducirá automáticamente a <strong>${targetTeams} equipos activos</strong> (${targetCards} cartas por equipo).`,
        waitLabel: "✏️ Agregar Estudiantes",
        confirmLabel: `🚀 Iniciar con ${targetTeams} Equipos`,
        onConfirm: () => launchProjectorMatch(targetTeams, names)
      });
      return;
    }

    launchProjectorMatch(numTeams, names);
  } else {
    gameState.userRole = "teacher";
    gameState.playerName = "";
    gameState.gameMode = "online";
    gameState.numTeams = numTeams;
    gameState.initialCardsPerTeam = getCardsPerTeamForCount(numTeams);
    gameState.joinedStudents = [];
    cleanupRealtimeChannel();

    const customCode = document.getElementById("inputTeacherRoomCode").value.trim().toUpperCase();
    gameState.roomCode = customCode || "AULA-101";
    gameState.isRoomHostActive = true;
    gameState.isGameStarted = false;
    gameState.isGameOver = false;

    closeAllModals();
    applyGameModeUI();

    document.getElementById("lobbyRoomCodeTitle").textContent = `SALA: ${gameState.roomCode}`;
    document.getElementById("modalOnlineLobby").classList.add("modal-overlay--active");

    initSupabaseRealtime();
    renderTeacherOnlineLobbyGrid();
  }
}

function renderTeacherOnlineLobbyGrid() {
  const grid = document.getElementById("onlineLobbyLiveTeamsGrid");
  const countEl = document.getElementById("lobbyConnectedStudentsCount");
  if (!grid) return;

  grid.innerHTML = "";
  countEl.textContent = `👥 ${gameState.joinedStudents.length} Conectados`;

  for (let t = 0; t < gameState.numTeams; t++) {
    const team = ALL_TEAMS[t];
    const members = gameState.joinedStudents.filter(s => s.teamId === t);

    const box = document.createElement("div");
    box.className = "lobby-team-box";
    box.innerHTML = `
      <div class="lobby-team-box__title" style="color: ${team.color}; font-weight: bold; font-family: var(--font-heading); margin-bottom: 0.4rem;">
        ${team.icon} ${team.name} (${members.length} integrantes)
      </div>
      <ul class="lobby-team-box__list" style="list-style: none; display: flex; flex-direction: column; gap: 0.3rem;">
        ${members.length > 0 ? members.map(m => `<li style="font-size: 0.85rem; color: var(--color-neon-cyan);">👤 ${m.name}</li>`).join("") : `<li style="color: var(--color-text-muted); font-size: 0.8rem;">Esperando alumnos...</li>`}
      </ul>
    `;
    grid.appendChild(box);
  }
}

function setStudentJoinStatus(message, type = "clear") {
  const box = document.getElementById("studentJoinStatusBox");
  if (!box) return;
  if (!message || type === "clear") {
    box.textContent = "";
    box.className = "join-status-box";
    return;
  }
  box.textContent = message;
  box.className = type === "error"
    ? "join-status-box join-status-box--error"
    : "join-status-box join-status-box--info";
}

function resetStudentJoinButtonUI() {
  const btn = document.getElementById("btnStudentJoinSubmit");
  if (btn) {
    btn.disabled = false;
    btn.textContent = "¡ENTRAR A LA SALA DE ESPERA! 🚀";
  }
}

function handleStudentJoinSubmit(e) {
  e.preventDefault();
  if (isVerifyingRoomJoin) return;

  const name = document.getElementById("inputStudentNameJoin").value.trim();
  const code = document.getElementById("inputStudentRoomCode").value.trim().toUpperCase();
  if (!name || !code) return;

  if (typeof supabase === 'undefined' || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    setStudentJoinStatus("❌ No se pudo conectar con el servicio multijugador. Revisa tu conexión a internet.", "error");
    return;
  }

  cleanupRealtimeChannel();

  gameState.userRole = "student";
  gameState.isRoomHostActive = false;
  gameState.isGameStarted = false;
  gameState.playerName = name;
  gameState.roomCode = code;
  gameState.gameMode = "online";

  isVerifyingRoomJoin = true;
  const btn = document.getElementById("btnStudentJoinSubmit");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "🔍 VERIFICANDO SALA...";
  }
  setStudentJoinStatus(`⏳ Verificando que el profesor haya creado la sala "${code}"...`, "info");

  const sendRoomCheckPing = () => {
    if (!realtimeChannel || !isVerifyingRoomJoin) return;
    realtimeChannel.send({
      type: 'broadcast',
      event: 'check_room_exists',
      senderId: gameState.myClientId,
      payload: {
        roomCode: code,
        studentName: name,
        clientId: gameState.myClientId
      }
    });
  };

  initSupabaseRealtime(() => {
    sendRoomCheckPing();
    roomJoinRetryTimeout = setTimeout(() => {
      if (isVerifyingRoomJoin) sendRoomCheckPing();
    }, 950);
  });

  // Si el profesor no responde dentro de 3.2s, bloquear ingreso a sala inexistente
  roomJoinVerifyTimeout = setTimeout(() => {
    if (!isVerifyingRoomJoin) return;
    isVerifyingRoomJoin = false;
    cleanupRealtimeChannel();
    resetStudentJoinButtonUI();
    playSynthSound('error');
    setStudentJoinStatus(
      `⚠️ La sala "${code}" aún no ha sido creada por el profesor. Espera a que tu profesor abra la sala de espera e intenta nuevamente.`,
      "error"
    );
  }, 3200);
}

function applyGameModeUI() {
  const layout = document.getElementById("mainGameLayout");
  const chatSidebar = document.getElementById("teamChatSidebar");
  const playerBox = document.getElementById("hudCardPlayerBox");
  const modeLabel = document.getElementById("currentModeLabel");
  const teamsBadge = document.getElementById("activeTeamsBadge");
  const btnExitToCover = document.getElementById("btnExitToCover");
  const btnChangeMode = document.getElementById("btnChangeModeSetting");
  const tabTeacherBtnLabel = document.getElementById("tabTeacherBtnLabel");
  const dashboardTitleText = document.getElementById("dashboardTitleText");

  teamsBadge.textContent = `${gameState.numTeams} Equipos Activos`;

  if (gameState.userRole === 'teacher') {
    // El profesor tiene "Cambiar Modo / Crear Partida" en la barra de modo; ocultamos "Salir a Portada" de la cabecera para evitar redundancia
    if (btnExitToCover) btnExitToCover.style.display = "none";
    if (btnChangeMode) btnChangeMode.style.display = "inline-flex";
    if (tabTeacherBtnLabel) tabTeacherBtnLabel.textContent = "📊 Dashboard Profesor";
    if (dashboardTitleText) dashboardTitleText.textContent = "📺 PANEL DOCENTE & ANÁLISIS DE DESEMPEÑO";
  } else {
    if (btnExitToCover) btnExitToCover.style.display = "inline-flex";
    if (btnChangeMode) btnChangeMode.style.display = "none";
    if (tabTeacherBtnLabel) tabTeacherBtnLabel.textContent = "📊 Tablero General";
    if (dashboardTitleText) dashboardTitleText.textContent = "📊 TABLERO GENERAL DE CLASE";
  }

  if (gameState.gameMode === 'projector') {
    modeLabel.textContent = "📺 Proyector de Aula (1 Pantalla)";
    layout.classList.add("game-layout--no-chat");
    if (chatSidebar) chatSidebar.style.display = "none";
    if (playerBox) playerBox.style.display = gameState.joinedStudents.length > 0 ? "flex" : "none";
  } else {
    modeLabel.textContent = `📱 Multijugador Online (Sala: ${gameState.roomCode})`;
    layout.classList.remove("game-layout--no-chat");
    if (chatSidebar) chatSidebar.style.display = "flex";
    if (playerBox) playerBox.style.display = "flex";
  }

  updatePostGameAndTeacherButtons();
  updateDashboardStatusIndicator();
}

function updatePostGameAndTeacherButtons() {
  const canTeacherControlMatch = Boolean(
    gameState.userRole === 'teacher' &&
    gameState.isGameStarted &&
    !gameState.isGameOver
  );

  const btnSkipBar = document.getElementById("btnTeacherSkipTurnBar");
  if (btnSkipBar) btnSkipBar.style.display = canTeacherControlMatch ? "inline-flex" : "none";

  const btnEndBar = document.getElementById("btnTeacherEndMatchBar");
  if (btnEndBar) btnEndBar.style.display = canTeacherControlMatch ? "inline-flex" : "none";

  const showReopenResults = Boolean(gameState.isGameStarted && gameState.isGameOver);
  const btnReopenBar = document.getElementById("btnReopenResultsBar");
  if (btnReopenBar) btnReopenBar.style.display = showReopenResults ? "inline-flex" : "none";
}

function openViewTeamsModal() {
  const container = document.getElementById("modalTeamsRosterContent");
  container.innerHTML = "";

  for (let t = 0; t < gameState.numTeams; t++) {
    const team = ALL_TEAMS[t];
    const members = gameState.joinedStudents.filter(s => s.teamId === t);
    const isVacatedMidGame = gameState.isGameStarted && usesAssignedRoster() && members.length === 0;

    const box = document.createElement("div");
    box.className = "lobby-team-box";
    box.innerHTML = `
      <div class="lobby-team-box__title" style="color: ${team.color};">
        ${team.icon} ${team.name} (${members.length} integrantes)
        ${isVacatedMidGame ? `<span class="team-empty-badge">Turno omitido</span>` : ""}
      </div>
      <ul class="lobby-team-box__list">
        ${members.length > 0
          ? members.map(m => `<li>👤 ${m.name}</li>`).join("")
          : `<li style="color: var(--color-text-muted);">${isVacatedMidGame ? "⚠️ Sin integrantes conectados (se omite en los turnos)" : "Sin asignaciones registradas"}</li>`}
      </ul>
    `;
    container.appendChild(box);
  }

  document.getElementById("modalViewTeams").classList.add("modal-overlay--active");
}

function closeViewTeamsModal() {
  document.getElementById("modalViewTeams").classList.remove("modal-overlay--active");
}

function openCardDetailModal(cardId) {
  const eventObj = HISTORICAL_EVENTS.find(c => c.id === cardId);
  if (!eventObj) return;

  document.getElementById("cardDetailYear").textContent = `AÑO: ${eventObj.year}`;
  document.getElementById("cardDetailTitle").textContent = eventObj.title;
  document.getElementById("cardDetailDesc").textContent = eventObj.desc;
  
  const imgEl = document.getElementById("cardDetailImage");
  imgEl.alt = eventObj.title;
  imgEl.src = eventObj.image;
  imgEl.onerror = () => { imgEl.src = 'https://via.placeholder.com/384x497?text=MuseumOfPlay'; };

  document.getElementById("modalCardDetail").classList.add("modal-overlay--active");
}

function closeCardDetailModal() {
  document.getElementById("modalCardDetail").classList.remove("modal-overlay--active");
}

function closeDiagnosticAndExploreTimeline() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  switchView('student');
  setTimeout(() => {
    const track = document.getElementById("timelineTrack");
    if (track) {
      track.scrollIntoView({ behavior: 'smooth' });
    }
  }, 150);
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

/* ==========================================================================
   GAMEPLAY ENGINE & DYNAMIC METRICS TRACKER
   ========================================================================== */

function initNewGame(shouldBroadcast = true) {
  gameState.reserveDeck = shuffleArray([...HISTORICAL_EVENTS]);
  gameState.tableCards = [];
  gameState.teamHands = { 0: [], 1: [], 2: [], 3: [] };
  gameState.teamStats = {
    0: { correct: 0, errors: 0, attempts: 0 },
    1: { correct: 0, errors: 0, attempts: 0 },
    2: { correct: 0, errors: 0, attempts: 0 },
    3: { correct: 0, errors: 0, attempts: 0 }
  };
  gameState.teamTurnCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  gameState.cardErrorTracker = {};
  gameState.currentTurnTeamIndex = 0;
  gameState.selectedHandCardId = null;
  
  gameState.turnTimesList = [];
  gameState.uniqueCardsSeenIds = [];
  
  gameState.totalTurnsPlayed = 0;
  gameState.totalRoundsCompleted = 1;
  gameState.currentRoundTurnCount = 0;
  gameState.isTieBreakMode = false;
  gameState.tieBreakTeamIndices = [];
  
  gameState.teamStreaks = { 0: 0, 1: 0, 2: 0, 3: 0 };
  gameState.isGameOver = false;
  gameState.endedByTeacher = false;
  gameState.winnerTeamIndex = null;
  gameState.isTie = false;
  gameState.tiedWinnerIndices = [];
  gameState.turnStartTimeStamp = Date.now();
  gameState.isMoveProcessing = false;
  incrementTurnSequence();
  resetChatMessagesBox();

  const anchorCard = gameState.reserveDeck.pop();
  gameState.tableCards.push(anchorCard);
  trackCardSeen(anchorCard.id);

  for (let t = 0; t < gameState.numTeams; t++) {
    for (let c = 0; c < gameState.initialCardsPerTeam; c++) {
      if (gameState.reserveDeck.length > 0) {
        const card = gameState.reserveDeck.pop();
        gameState.teamHands[t].push(card);
        trackCardSeen(card.id);
      }
    }
  }

  let firstEligible = 0;
  while (firstEligible < gameState.numTeams && !isTeamEligibleToPlay(firstEligible)) {
    firstEligible++;
  }
  if (firstEligible < gameState.numTeams) {
    gameState.currentTurnTeamIndex = firstEligible;
    gameState.currentRoundTurnCount = firstEligible;
  }

  updateHud();
  renderTimelineTable();
  renderTeamHand();
  renderTeacherDashboard();
  startTurnTimer();
  if (shouldBroadcast) {
    broadcastGameState();
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getActiveRepresentativeName() {
  const teamIdx = gameState.currentTurnTeamIndex;
  const activeTeamMembers = gameState.joinedStudents.filter(s => s.teamId === teamIdx);
  if (activeTeamMembers.length > 0) {
    // Rotar representante usando los turnos jugados específicamente por ESE equipo
    const teamTurns = (gameState.teamTurnCounts && gameState.teamTurnCounts[teamIdx] !== undefined)
      ? gameState.teamTurnCounts[teamIdx]
      : 0;
    const repIndex = teamTurns % activeTeamMembers.length;
    return activeTeamMembers[repIndex].name;
  }
  return `Representante ${ALL_TEAMS[teamIdx].name}`;
}

function updateHud() {
  if (gameState.gameMode === 'projector' || gameState.userRole === 'teacher') {
    gameState.userTeamId = gameState.currentTurnTeamIndex;
  }

  const myIdentityBadge = document.getElementById("hudMyIdentityBadge");
  if (myIdentityBadge) {
    if (gameState.playerName && gameState.userRole === 'student') {
      myIdentityBadge.style.display = "inline-flex";
      myIdentityBadge.textContent = `👤 Tú: ${gameState.playerName} (${ALL_TEAMS[gameState.userTeamId].name})`;
    } else {
      myIdentityBadge.style.display = "none";
    }
  }

  const currentTeam = ALL_TEAMS[gameState.currentTurnTeamIndex];
  document.getElementById("hudTeamName").textContent = `${currentTeam.icon} ${currentTeam.name}`;
  
  const activePlayerName = getActiveRepresentativeName();
  const playerValEl = document.getElementById("hudActiveTurnPlayer");
  if (playerValEl) playerValEl.textContent = activePlayerName;
  
  const myTurnAlertBanner = document.getElementById("myTurnAlertBanner");
  const playerBox = document.getElementById("hudCardPlayerBox");
  const subtextEl = document.getElementById("hudTurnPlayerSubtext");

  const isMyTurn = (
    !gameState.isGameOver &&
    gameState.userRole === 'student' &&
    gameState.userTeamId === gameState.currentTurnTeamIndex &&
    gameState.playerName &&
    gameState.playerName.toLowerCase() === activePlayerName.toLowerCase()
  );

  if (isMyTurn) {
    if (myTurnAlertBanner) {
      myTurnAlertBanner.style.display = "block";
      myTurnAlertBanner.textContent = `🌟 ¡ATENCIÓN ${gameState.playerName.toUpperCase()}! ES TU TURNO DE COLOCAR LA CARTA DE TU EQUIPO 🌟`;
    }
    if (playerBox) {
      playerBox.style.boxShadow = "0 0 20px rgba(255, 0, 85, 0.8)";
      playerBox.style.borderLeftColor = "var(--color-neon-pink)";
    }
    if (subtextEl) subtextEl.textContent = "👉 ¡TE TOCA A TI JUGAR ESTE TURNO!";
  } else {
    if (myTurnAlertBanner) myTurnAlertBanner.style.display = "none";
    if (playerBox) {
      playerBox.style.boxShadow = "none";
      playerBox.style.borderLeftColor = "var(--color-neon-cyan)";
    }
    if (subtextEl) {
      subtextEl.textContent = gameState.isGameOver
        ? "🏁 Partida finalizada — Consulta los resultados"
        : `⏳ Esperando movimiento de ${activePlayerName}`;
    }
  }

  if (gameState.isGameOver) {
    const timerValEl = document.getElementById("hudTurnTimer");
    if (timerValEl) timerValEl.textContent = "FIN";
  }

  const currentHand = gameState.teamHands[gameState.userTeamId] || [];
  document.getElementById("handCountLabel").textContent = `${currentHand.length} cartas restantes en mano de ${ALL_TEAMS[gameState.userTeamId].name}`;
  updatePostGameAndTeacherButtons();
}

/* ==========================================================================
   ⏱️ SISTEMA DE TEMPORIZADOR UNIFICADO Y SINCRONIZADO EN TIEMPO REAL
   ========================================================================== */
function startTurnTimer() {
  if (gameState.turnTimerInterval) clearInterval(gameState.turnTimerInterval);
  if (!gameState.turnStartTimeStamp) gameState.turnStartTimeStamp = Date.now();

  gameState.lastTickedSecond = -1;
  updateTimerUI();

  gameState.turnTimerInterval = setInterval(() => {
    if (!gameState.turnStartTimeStamp || gameState.isGameOver || !gameState.isGameStarted) return;

    const elapsedSec = Math.floor((Date.now() - gameState.turnStartTimeStamp) / 1000);
    const remaining = Math.max(0, 60 - elapsedSec);
    gameState.turnTimeLeft = remaining;

    updateTimerUI();

    if (remaining <= 5 && remaining > 0 && elapsedSec !== gameState.lastTickedSecond) {
      gameState.lastTickedSecond = elapsedSec;
      playSynthSound('tick');
    }

    if (remaining <= 0) {
      const activePlayerName = getActiveRepresentativeName();
      const isMyActiveTurn = (
        gameState.userRole === 'student' &&
        gameState.userTeamId === gameState.currentTurnTeamIndex &&
        gameState.playerName &&
        gameState.playerName.toLowerCase() === activePlayerName.toLowerCase()
      );

      // El profesor dispara el timeout autoritativo en 60s; el alumno activo actúa como respaldo en 62s si la pestaña docente está suspendida
      if (gameState.userRole === 'teacher' && elapsedSec >= 60) {
        clearInterval(gameState.turnTimerInterval);
        handleTurnTimeout();
      } else if (isMyActiveTurn && elapsedSec >= 62) {
        clearInterval(gameState.turnTimerInterval);
        handleTurnTimeout();
      }
    }
  }, 400);
}

function recordTurnTime() {
  if (gameState.turnStartTimeStamp > 0) {
    const elapsedSec = Math.max(1, Math.round((Date.now() - gameState.turnStartTimeStamp) / 1000));
    gameState.turnTimesList.push(elapsedSec);
  }
}

function updateTimerUI() {
  const timerValEl = document.getElementById("hudTurnTimer");
  const fill = document.getElementById("hudTimerFill");
  if (!timerValEl || !fill) return;

  timerValEl.textContent = `${gameState.turnTimeLeft}s`;
  const pct = (gameState.turnTimeLeft / 60) * 100;
  fill.style.width = `${pct}%`;

  if (gameState.turnTimeLeft <= 5) {
    fill.classList.add("timer-bar__fill--critical");
  } else {
    fill.classList.remove("timer-bar__fill--critical");
  }
}

function handleTurnTimeout() {
  if (gameState.isGameOver || gameState.isMoveProcessing) return;
  gameState.isMoveProcessing = true;
  playSynthSound('error');
  recordTurnTime();

  const timedOutTeam = gameState.currentTurnTeamIndex;
  addChatMessage("🤖 Sistema", `⏱️ ¡Tiempo agotado (60s)! ${ALL_TEAMS[timedOutTeam].name} pierde el turno.`);
  gameState.teamStreaks[timedOutTeam] = 0;
  gameState.teamTurnCounts[timedOutTeam] = (gameState.teamTurnCounts[timedOutTeam] || 0) + 1;
  gameState.totalTurnsPlayed++;
  gameState.currentRoundTurnCount++;
  advanceTurnOrEvaluateRound();
}

function teacherSkipCurrentTurn() {
  if (gameState.userRole !== 'teacher' || !gameState.isGameStarted || gameState.isGameOver || gameState.isMoveProcessing) return;
  gameState.isMoveProcessing = true;
  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }
  playSynthSound('tick');

  const skippedTeam = gameState.currentTurnTeamIndex;
  const skippedRep = usesAssignedRoster() ? getActiveRepresentativeName() : null;
  gameState.selectedHandCardId = null;
  gameState.teamStreaks[skippedTeam] = 0;
  gameState.teamTurnCounts[skippedTeam] = (gameState.teamTurnCounts[skippedTeam] || 0) + 1;
  gameState.totalTurnsPlayed++;
  gameState.currentRoundTurnCount++;

  const skipNotice = skippedRep
    ? `⏭️ El profesor saltó el turno actual de ${ALL_TEAMS[skippedTeam].name} (${skippedRep}).`
    : `⏭️ El profesor saltó el turno actual de ${ALL_TEAMS[skippedTeam].name}.`;
  addChatMessage("🤖 Sistema", skipNotice);

  advanceTurnOrEvaluateRound();
}

function renderTimelineTable() {
  const track = document.getElementById("timelineTrack");
  track.innerHTML = "";

  const count = gameState.tableCards.length;

  for (let i = 0; i <= count; i++) {
    if (!gameState.isGameOver) {
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
    }

    if (i < count) {
      const card = gameState.tableCards[i];
      const cardEl = document.createElement("div");
      cardEl.className = "timeline-card";

      cardEl.innerHTML = `
        <button class="timeline-card__info-btn" title="Ver historia del evento" onclick="event.stopPropagation(); openCardDetailModal(${card.id})">ℹ️</button>
        <div class="timeline-card__year-badge">${card.year}</div>
        <div class="timeline-card__image-container">
          <img src="${card.image}" alt="${card.title}" class="timeline-card__image" onerror="this.src='https://via.placeholder.com/150x100?text=MuseumOfPlay'">
        </div>
        <div class="timeline-card__title">${card.title}</div>
      `;
      track.appendChild(cardEl);
    }
  }

  renderTeacherDashboard();
}

function renderTeamHand() {
  const grid = document.getElementById("teamHandGrid");
  grid.innerHTML = "";

  const hand = gameState.teamHands[gameState.userTeamId] || [];

  if (hand.length === 0) {
    grid.innerHTML = `<div style="color: var(--color-neon-green); font-family: var(--font-heading); padding: 1rem;">¡Mano vacía! Este equipo ha liberado todas sus cartas y espera el final de la ronda.</div>`;
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
  if (gameState.isGameOver || gameState.isMoveProcessing) return;

  if (gameState.gameMode === 'online' && gameState.userRole === 'student') {
    if (gameState.userTeamId !== gameState.currentTurnTeamIndex) {
      alert(`⚠️ ¡Aún no es tu turno! Es el turno de ${ALL_TEAMS[gameState.currentTurnTeamIndex].name}.`);
      return;
    }

    const activePlayerName = getActiveRepresentativeName();
    if (gameState.playerName && gameState.playerName.toLowerCase() !== activePlayerName.toLowerCase()) {
      alert(`⚠️ ¡Es el turno de tu compañero de equipo ${activePlayerName} para realizar el tiro!`);
      return;
    }
  }

  if (!gameState.selectedHandCardId) {
    alert("¡Selecciona primero una carta de tu mano antes de hacer clic en un slot [+]!");
    return;
  }

  gameState.isMoveProcessing = true;
  recordTurnTime();

  const activeTeamIndex = gameState.currentTurnTeamIndex;
  const activeHand = gameState.teamHands[activeTeamIndex];
  const cardIndexInHand = activeHand.findIndex(c => c.id === gameState.selectedHandCardId);

  if (cardIndexInHand === -1) {
    gameState.isMoveProcessing = false;
    return;
  }

  const cardToPlace = activeHand[cardIndexInHand];
  gameState.teamStats[activeTeamIndex].attempts++;
  gameState.teamTurnCounts[activeTeamIndex] = (gameState.teamTurnCounts[activeTeamIndex] || 0) + 1;
  gameState.totalTurnsPlayed++;
  gameState.currentRoundTurnCount++;

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

    addChatMessage("🤖 Sistema", `¡ACIERTO! ${ALL_TEAMS[activeTeamIndex].name} colocó '${cardToPlace.title}' (${cardToPlace.year}) correctamente. (Haz clic en ℹ️ para leer su historia).`);

  } else {
    playSynthSound('error');
    gameState.teamStats[activeTeamIndex].errors++;
    gameState.teamStreaks[activeTeamIndex] = 0;

    gameState.cardErrorTracker[cardToPlace.id] = (gameState.cardErrorTracker[cardToPlace.id] || 0) + 1;

    // La tarjeta permanece en la mano del equipo (con su año oculto) para que puedan reintentar en su próximo turno
    gameState.selectedHandCardId = null;
    addChatMessage("🤖 Sistema", `❌ FALLO. ${ALL_TEAMS[activeTeamIndex].name} no acertó la ubicación cronológica de '${cardToPlace.title}'. Conservan la tarjeta en su mano para reintentar en su próximo turno.`);
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

  // Independientemente de acierto o fallo, siempre se cede el turno al siguiente equipo
  advanceTurnOrEvaluateRound();
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

function finalizeMatchNoActiveStudents() {
  if (gameState.isGameOver) return;
  const outcome = computeCurrentStandingsOutcome();
  gameState.isGameOver = true;
  gameState.endedByTeacher = true;
  gameState.winnerTeamIndex = outcome.winnerTeamIndex;
  gameState.isTie = outcome.isTie;
  gameState.tiedWinnerIndices = outcome.tiedWinnerIndices;
  gameState.isMoveProcessing = false;
  gameState.selectedHandCardId = null;
  incrementTurnSequence();

  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }

  updateHud();
  renderTimelineTable();
  renderTeamHand();
  renderTeacherDashboard();
  showGameOverModal(outcome.winnerTeamIndex, outcome.isTie, outcome.tiedWinnerIndices, false);
  sendWebhookTelemetry();
  broadcastGameState();
}

function advanceTurnOrEvaluateRound() {
  const activeTeamsList = (gameState.isTieBreakMode && gameState.tieBreakTeamIndices.length > 0)
    ? gameState.tieBreakTeamIndices
    : Array.from({ length: gameState.numTeams }, (_, i) => i);

  const previousTeamIndex = gameState.currentTurnTeamIndex;
  gameState.turnStartTimeStamp = Date.now();
  incrementTurnSequence();

  // Avanzar estrictamente hacia adelante dentro de la ronda actual omitiendo en 0s equipos sin cartas o sin integrantes
  const currentPosInList = activeTeamsList.indexOf(previousTeamIndex);
  if (currentPosInList >= 0) {
    let nextPos = currentPosInList + 1;
    while (nextPos < activeTeamsList.length && !isTeamEligibleToPlay(activeTeamsList[nextPos])) {
      nextPos++;
    }

    if (nextPos < activeTeamsList.length) {
      gameState.currentTurnTeamIndex = activeTeamsList[nextPos];
      gameState.currentRoundTurnCount = nextPos;
      gameState.selectedHandCardId = null;
      gameState.isMoveProcessing = false;
      updateHud();
      renderTeamHand();
      startTurnTimer();
      broadcastGameState();
      return;
    }
  }

  // EVALUACIÓN OFICIAL AL FINALIZAR LA RONDA (todos los equipos activos jugaron o fueron omitidos si quedaron vacíos)
  gameState.currentRoundTurnCount = 0;
  gameState.totalRoundsCompleted++;

  const zeroCardTeams = activeTeamsList.filter(t => gameState.teamHands[t].length === 0);

  if (zeroCardTeams.length === 1) {
    gameState.isMoveProcessing = false;
    declareWinner(zeroCardTeams[0]);
    return;
  }

  if (zeroCardTeams.length > 1) {
    const activeZeroCardTeams = usesAssignedRoster()
      ? zeroCardTeams.filter(t => getTeamMemberCount(t) > 0)
      : zeroCardTeams;

    if (activeZeroCardTeams.length === 1) {
      gameState.isMoveProcessing = false;
      declareWinner(activeZeroCardTeams[0]);
      return;
    }

    const tieTeams = activeZeroCardTeams.length > 1 ? activeZeroCardTeams : zeroCardTeams;
    gameState.isTieBreakMode = true;
    gameState.tieBreakTeamIndices = tieTeams;

    addChatMessage("🤖 Sistema", `⚡ ¡¡DESEMPATE DE INFARTO!! Los equipos ${tieTeams.map(t => ALL_TEAMS[t].name).join(" y ")} terminaron la ronda sin cartas. ¡Cada uno roba 1 carta para la ronda de desempate!`);

    let availableDeck = gameState.reserveDeck.length > 0;
    tieTeams.forEach(t => {
      if (gameState.reserveDeck.length > 0) {
        const tieCard = gameState.reserveDeck.pop();
        gameState.teamHands[t].push(tieCard);
        trackCardSeen(tieCard.id);
      }
    });

    if (!availableDeck) {
      gameState.isMoveProcessing = false;
      declareTie(tieTeams);
      return;
    }

    let firstTiePos = 0;
    while (firstTiePos < tieTeams.length && !isTeamEligibleToPlay(tieTeams[firstTiePos])) {
      firstTiePos++;
    }
    if (firstTiePos >= tieTeams.length) {
      gameState.isMoveProcessing = false;
      finalizeMatchNoActiveStudents();
      return;
    }

    gameState.currentTurnTeamIndex = tieTeams[firstTiePos];
    gameState.currentRoundTurnCount = firstTiePos;
    gameState.selectedHandCardId = null;
    gameState.isMoveProcessing = false;
    updateHud();
    renderTeamHand();
    startTurnTimer();
    broadcastGameState();
    return;
  }

  if (gameState.isTieBreakMode && gameState.reserveDeck.length === 0) {
    gameState.isMoveProcessing = false;
    declareTie(gameState.tieBreakTeamIndices);
    return;
  }

  // Inicio de la nueva ronda: seleccionar el primer equipo elegible (con cartas y con integrantes conectados)
  const refreshedTeamsList = (gameState.isTieBreakMode && gameState.tieBreakTeamIndices.length > 0)
    ? gameState.tieBreakTeamIndices
    : Array.from({ length: gameState.numTeams }, (_, i) => i);

  let startPos = 0;
  while (startPos < refreshedTeamsList.length && !isTeamEligibleToPlay(refreshedTeamsList[startPos])) {
    startPos++;
  }

  if (startPos >= refreshedTeamsList.length) {
    gameState.isMoveProcessing = false;
    finalizeMatchNoActiveStudents();
    return;
  }

  gameState.currentTurnTeamIndex = refreshedTeamsList[startPos];
  gameState.currentRoundTurnCount = startPos;
  gameState.selectedHandCardId = null;
  gameState.isMoveProcessing = false;
  applyGameModeUI();
  updateHud();
  renderTeamHand();
  startTurnTimer();
  broadcastGameState();
}

function declareWinner(winnerTeamIndex) {
  gameState.isGameOver = true;
  gameState.endedByTeacher = false;
  gameState.winnerTeamIndex = winnerTeamIndex;
  gameState.isTie = false;
  gameState.tiedWinnerIndices = [];
  incrementTurnSequence();

  clearInterval(gameState.turnTimerInterval);
  updateHud();
  renderTimelineTable();
  showGameOverModal(winnerTeamIndex, false);
  sendWebhookTelemetry();
  broadcastGameState();
}

function declareTie(tiedTeamIndices) {
  gameState.isGameOver = true;
  gameState.endedByTeacher = false;
  gameState.winnerTeamIndex = null;
  gameState.isTie = true;
  gameState.tiedWinnerIndices = tiedTeamIndices || [];
  incrementTurnSequence();

  clearInterval(gameState.turnTimerInterval);
  updateHud();
  renderTimelineTable();
  showGameOverModal(null, true, tiedTeamIndices);
  sendWebhookTelemetry();
  broadcastGameState();
}

function openConfirmEndMatchModal() {
  if (gameState.userRole !== 'teacher' || !gameState.isGameStarted || gameState.isGameOver) return;
  const modal = document.getElementById("modalConfirmEndMatch");
  if (modal) modal.classList.add("modal-overlay--active");
}

function closeConfirmEndMatchModal() {
  const modal = document.getElementById("modalConfirmEndMatch");
  if (modal) modal.classList.remove("modal-overlay--active");
}

function computeCurrentStandingsOutcome() {
  const checkRoster = usesAssignedRoster();
  const hasAnyOccupiedTeam = checkRoster && Array.from({ length: gameState.numTeams }, (_, i) => i)
    .some(t => getTeamMemberCount(t) > 0);

  const teams = [];
  for (let t = 0; t < gameState.numTeams; t++) {
    const stats = gameState.teamStats[t] || { correct: 0, errors: 0, attempts: 0 };
    const cardsRemaining = (gameState.teamHands[t] || []).length;
    const eff = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
    const isAbandoned = Boolean(hasAnyOccupiedTeam && getTeamMemberCount(t) === 0);
    teams.push({
      teamIndex: t,
      team: ALL_TEAMS[t],
      cardsRemaining,
      correct: stats.correct,
      errors: stats.errors,
      attempts: stats.attempts,
      eff,
      isAbandoned
    });
  }

  // Ordenar: 0) Equipos con integrantes activos antes que equipos vacíos, 1) Menos cartas restantes, 2) Mayor efectividad %, 3) Más aciertos
  teams.sort((a, b) => {
    if (a.isAbandoned !== b.isAbandoned) return a.isAbandoned ? 1 : -1;
    if (a.cardsRemaining !== b.cardsRemaining) return a.cardsRemaining - b.cardsRemaining;
    if (b.eff !== a.eff) return b.eff - a.eff;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return a.teamIndex - b.teamIndex;
  });

  const top = teams[0];
  const coLeaders = teams.filter(item =>
    item.isAbandoned === top.isAbandoned &&
    item.cardsRemaining === top.cardsRemaining &&
    item.eff === top.eff &&
    item.correct === top.correct
  );

  const isTie = coLeaders.length > 1;
  return {
    rankedTeams: teams,
    winnerTeamIndex: isTie ? null : top.teamIndex,
    isTie,
    tiedWinnerIndices: isTie ? coLeaders.map(c => c.teamIndex) : []
  };
}

function confirmTeacherEndMatch() {
  closeConfirmEndMatchModal();
  if (gameState.userRole !== 'teacher' || !gameState.isGameStarted || gameState.isGameOver) return;

  const outcome = computeCurrentStandingsOutcome();
  gameState.isGameOver = true;
  gameState.endedByTeacher = true;
  gameState.winnerTeamIndex = outcome.winnerTeamIndex;
  gameState.isTie = outcome.isTie;
  gameState.tiedWinnerIndices = outcome.tiedWinnerIndices;
  gameState.isMoveProcessing = false;
  gameState.selectedHandCardId = null;
  incrementTurnSequence();

  if (gameState.turnTimerInterval) {
    clearInterval(gameState.turnTimerInterval);
    gameState.turnTimerInterval = null;
  }

  if (gameState.gameMode === 'online') {
    addChatMessage("🤖 Sistema", "🛑 El profesor ha finalizado la partida. Mostrando clasificación y resultados finales.");
  }

  updateHud();
  renderTimelineTable();
  renderTeamHand();
  renderTeacherDashboard();
  showGameOverModal(outcome.winnerTeamIndex, outcome.isTie, outcome.tiedWinnerIndices, true);
  sendWebhookTelemetry();
  broadcastGameState();
}

function reopenGameOverModal() {
  if (!gameState.isGameOver) return;
  const tiedList = (gameState.tiedWinnerIndices && gameState.tiedWinnerIndices.length > 0)
    ? gameState.tiedWinnerIndices
    : (gameState.tieBreakTeamIndices || []);
  showGameOverModal(gameState.winnerTeamIndex, gameState.isTie, tiedList, false);
}

function teacherRematchSameRoom() {
  if (gameState.userRole !== 'teacher') return;
  if (gameState.gameMode === 'online') {
    teacherStartMatchForAllStudents(true);
  } else {
    closeAllModals();
    gameState.isGameStarted = true;
    switchView('student');
    initNewGame(false);
  }
}

function showGameOverModal(winnerTeamIndex, isTie = false, tiedTeamIndices = [], playCelebration = true) {
  closeConfirmEndMatchModal();
  closeConfirmExitModal();
  closeCardDetailModal();
  closeViewTeamsModal();

  if (playCelebration) {
    playSynthSound('victory');
    launchConfetti();
  }

  let totalAttempts = 0;
  let totalCorrect = 0;
  for (let t = 0; t < gameState.numTeams; t++) {
    totalAttempts += gameState.teamStats[t].attempts;
    totalCorrect += gameState.teamStats[t].correct;
  }
  const globalAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const diagAccEl = document.getElementById("diagAccuracy");
  if (diagAccEl) diagAccEl.textContent = `${globalAccuracy}%`;

  const diagRoundsEl = document.getElementById("diagRounds");
  if (diagRoundsEl) diagRoundsEl.textContent = `${gameState.totalRoundsCompleted}`;

  const diagWinnerSubtitle = document.getElementById("diagWinnerSubtitle");
  if (diagWinnerSubtitle) {
    diagWinnerSubtitle.textContent = gameState.endedByTeacher
      ? "🛑 Partida finalizada por el profesor • Clasificación y desempeño de la sesión:"
      : "🏁 Partida completada • Resumen de desempeño y efectividad de la sesión:";
  }

  const effectiveTiedList = (tiedTeamIndices && tiedTeamIndices.length > 0)
    ? tiedTeamIndices
    : (gameState.tiedWinnerIndices || []);

  if (isTie) {
    const names = effectiveTiedList.length > 0
      ? effectiveTiedList.map(t => ALL_TEAMS[t].name).join(" y ")
      : "LOS EQUIPOS LÍDERES";
    document.getElementById("diagTitle").textContent = `⚖️ ¡EMPATE OFICIAL ENTRE ${names.toUpperCase()}!`;
  } else if (winnerTeamIndex !== null && winnerTeamIndex !== undefined) {
    const winner = ALL_TEAMS[winnerTeamIndex];
    document.getElementById("diagTitle").textContent = `🏆 ¡${winner.name.toUpperCase()} HA GANADO LA PARTIDA!`;
  } else {
    document.getElementById("diagTitle").textContent = "🏆 ¡PARTIDA FINALIZADA!";
  }

  // Renderizar tabla de clasificación final por equipos
  const standingsListEl = document.getElementById("diagStandingsList");
  if (standingsListEl) {
    const { rankedTeams } = computeCurrentStandingsOutcome();
    const medals = ["🥇", "🥈", "🥉", "4°"];
    standingsListEl.innerHTML = rankedTeams.map((item, idx) => {
      const isLeader = isTie
        ? effectiveTiedList.includes(item.teamIndex)
        : (item.teamIndex === winnerTeamIndex);
      const badge = isLeader ? "🥇" : (medals[idx] || `${idx + 1}°`);
      return `
        <div class="final-standings__row ${isLeader ? 'final-standings__row--leader' : ''}">
          <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
            <span>${badge}</span>
            <strong style="color: ${item.team.color};">${item.team.icon} ${item.team.name}</strong>
            ${item.isAbandoned ? `<span class="team-empty-badge">Sin integrantes</span>` : ""}
          </div>
          <div class="final-standings__meta">
            <span>🎴 ${item.cardsRemaining} rest.</span>
            <span>✅ ${item.correct}/${item.attempts}</span>
            <strong style="color: var(--color-neon-cyan);">${item.eff}%</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  const feedbackEl = document.getElementById("diagFeedbackMessage");
  if (feedbackEl) {
    feedbackEl.textContent = `¡Excelente trabajo en equipo! Lograron ordenar ${gameState.tableCards.length} hitos históricos en la línea de tiempo. Pueden explorarla a continuación.`;
  }

  // Estado de permanencia en la misma sala (modo en línea)
  const roomNote = document.getElementById("diagStudentRoomStatusNote");
  if (roomNote) {
    if (gameState.gameMode === 'online') {
      roomNote.style.display = "block";
      if (gameState.userRole === 'student') {
        roomNote.textContent = realtimeChannel
          ? `🟢 Sigues conectado en la sala ${gameState.roomCode}: si el profesor inicia otra partida, entrarás automáticamente.`
          : "ℹ️ El profesor cerró la sala activa. Puedes seguir explorando los resultados o salir a la portada.";
      } else {
        roomNote.textContent = realtimeChannel
          ? `🟢 Sala ${gameState.roomCode} activa (${gameState.joinedStudents.length} estudiantes siguen conectados si deseas iniciar otra partida).`
          : "";
        if (!realtimeChannel) roomNote.style.display = "none";
      }
    } else {
      roomNote.style.display = "none";
    }
  }

  // Botonera post-partida diferenciada según rol (Profesor vs Estudiante)
  const teacherActions = document.getElementById("diagTeacherActions");
  const studentActions = document.getElementById("diagStudentActions");
  if (gameState.userRole === 'teacher') {
    if (teacherActions) {
      teacherActions.style.display = "flex";
      const rematchBtn = teacherActions.querySelector(".btn-primary");
      if (rematchBtn) {
        rematchBtn.textContent = gameState.gameMode === 'online'
          ? "🔄 NUEVA PARTIDA (MISMA SALA Y EQUIPOS)"
          : "🔄 NUEVA PARTIDA (MISMOS EQUIPOS)";
      }
    }
    if (studentActions) studentActions.style.display = "none";
  } else {
    if (teacherActions) teacherActions.style.display = "none";
    if (studentActions) studentActions.style.display = "flex";
  }

  updatePostGameAndTeacherButtons();
  document.getElementById("modalDiagnostic").classList.add("modal-overlay--active");
}

function resetChatMessagesBox() {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  container.innerHTML = `
    <div class="chat-msg">
      <span class="chat-msg__sender">🤖 Sistema:</span>
      ¡Bienvenidos! Utilicen este chat para debatir la fecha entre su equipo antes de tirar la carta.
    </div>
  `;
}

function handleSendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const msgText = input.value.trim();
  if (!msgText) return;

  const sender = `${gameState.playerName ? gameState.playerName : 'Jugador'} (${ALL_TEAMS[gameState.userTeamId].name})`;
  addChatMessage(sender, msgText, true);
  input.value = "";
}

function addChatMessage(sender, text, shouldBroadcast = true) {
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

  if (shouldBroadcast) {
    broadcastChatMessage(sender, text);
  }
}

/* ==========================================================================
   📊 DASHBOARD CON MÉTRICAS Y KPIS DINÁMICOS
   ========================================================================== */
function updateDashboardStatusIndicator() {
  const indicator = document.getElementById("dashboardStatusIndicator");
  const dot = document.getElementById("dashboardStatusDot");
  const text = document.getElementById("dashboardStatusText");
  if (!indicator || !text) return;

  if (gameState.isGameStarted && !gameState.isGameOver) {
    indicator.className = "live-indicator live-indicator--active";
    if (dot) dot.style.display = "inline-block";
    text.textContent = gameState.gameMode === 'online'
      ? "Partida en curso • Sincronizado en tiempo real"
      : `Partida en curso • Ronda ${gameState.totalRoundsCompleted}`;
  } else if (gameState.isGameStarted && gameState.isGameOver) {
    indicator.className = "live-indicator live-indicator--finished";
    if (dot) dot.style.display = "none";
    text.textContent = "🏁 Partida finalizada • Resultados finales";
  } else {
    indicator.className = "live-indicator live-indicator--idle";
    if (dot) dot.style.display = "none";
    text.textContent = "⏳ Esperando inicio de partida";
  }
}

function renderTeacherDashboard() {
  updateDashboardStatusIndicator();
  document.getElementById("kpiActiveStudents").textContent = `${gameState.numTeams} Equipos`;
  const kpiCardsPerTeamMeta = document.getElementById("kpiCardsPerTeamMeta");
  if (kpiCardsPerTeamMeta) {
    kpiCardsPerTeamMeta.textContent = `● ${gameState.initialCardsPerTeam} cartas en mano por equipo`;
  }

  let totalAttempts = 0;
  let totalCorrect = 0;
  for (let t = 0; t < gameState.numTeams; t++) {
    totalAttempts += gameState.teamStats[t].attempts;
    totalCorrect += gameState.teamStats[t].correct;
  }
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  document.getElementById("kpiAvgAccuracy").textContent = `${overallAccuracy}%`;

  let avgTime = 0;
  let bestTime = 0;
  if (gameState.turnTimesList && gameState.turnTimesList.length > 0) {
    const sumTime = gameState.turnTimesList.reduce((a, b) => a + b, 0);
    avgTime = Math.round(sumTime / gameState.turnTimesList.length);
    bestTime = Math.min(...gameState.turnTimesList);
  }
  document.getElementById("kpiAvgTime").textContent = `${avgTime}s`;
  const kpiAvgTimeMeta = document.getElementById("kpiAvgTimeMeta");
  if (kpiAvgTimeMeta) {
    kpiAvgTimeMeta.textContent = gameState.turnTimesList && gameState.turnTimesList.length > 0
      ? `● Mejor tiempo registrado: ${bestTime}s`
      : `● Máximo 60s por turno`;
  }

  const cardsInTableCount = gameState.tableCards.length;
  const uniqueSeenCount = (gameState.uniqueCardsSeenIds && gameState.uniqueCardsSeenIds.length > 0)
    ? gameState.uniqueCardsSeenIds.length
    : (1 + (gameState.numTeams * gameState.initialCardsPerTeam));

  const totalRevealedCount = Math.max(cardsInTableCount, uniqueSeenCount);

  document.getElementById("kpiCardsInTable").textContent = `${cardsInTableCount}`;
  const kpiCardsInTableMeta = document.getElementById("kpiCardsInTableMeta");
  if (kpiCardsInTableMeta) {
    kpiCardsInTableMeta.textContent = `● Ordenadas: ${cardsInTableCount} de ${totalRevealedCount} cartas reveladas`;
  }

  const tbody = document.getElementById("leaderboardBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  for (let t = 0; t < gameState.numTeams; t++) {
    const team = ALL_TEAMS[t];
    const stats = gameState.teamStats[t];
    const handCount = gameState.teamHands[t].length;
    const eff = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
    const isVacatedMidGame = gameState.isGameStarted && usesAssignedRoster() && getTeamMemberCount(t) === 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong style="color: ${team.color};">${team.icon} ${team.name}</strong>
        ${isVacatedMidGame ? `<span class="team-empty-badge">Turno omitido</span>` : ""}
      </td>
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
  requestExitToCover();
}

function closeDiagnosticAndGoDashboard() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  switchView('teacher');
}
