/* ==========================================================================
   RETRO TIMELINE ACADEMY - CORE ENGINE
   Estudiante Minijuego + Dashboard Profesor en Vivo
   ========================================================================== */

// 🔗 CONSTANTE DEL WEBHOOK (Modificable por el profesor/integrador)
const WEBHOOK_URL = "";

// 📜 BASE DE DATOS HISTÓRICA COMPLETA DE LOS VIDEOJUEGOS (31 Eventos)
const HISTORICAL_EVENTS = [
  { id: 1, year: 1940, decade: "1940s", title: "Computadora Nim (Edward U. Condon)", desc: "Edward U. Condon diseña una computadora que juega Nim. Miles de personas juegan y la máquina gana.", hint: "💡 Pista: Fue en los inicios de la computación matemática militar/académica de la década de 1940.", icon: "🧮" },
  { id: 2, year: 1947, decade: "1940s", title: "Cathode-Ray Tube Amusement Device", desc: "Thomas T. Goldsmith Jr. y Estle Ray Mann patentan el primer dispositivo de entretenimiento interactivo con pantalla CRT.", hint: "💡 Pista: Ocurrió justo después de la Segunda Guerra Mundial (1947).", icon: "📺" },
  { id: 3, year: 1950, decade: "1950s", title: "Artículo de Claude Shannon sobre Ajedrez", desc: "Claude Shannon publica un artículo pionero sobre cómo programar una computadora para jugar al ajedrez.", hint: "💡 Pista: Marco teórico fundamental de IA publicado a inicios de los 50s (1950).", icon: "♟️" },
  { id: 4, year: 1952, decade: "1950s", title: "OXO (Tres en Raya en EDSAC)", desc: "A.S. Douglas crea OXO en la computadora EDSAC para su tesis de doctorado en Cambridge.", hint: "💡 Pista: Primer juego gráfico en computadora de la década de 1950.", icon: "⭕" },
  { id: 5, year: 1958, decade: "1950s", title: "Tennis for Two (Willy Higinbotam)", desc: "Willy Higinbotam crea un juego interactivo de tenis proyectado en un osciloscopio en el laboratorio Brookhaven.", hint: "💡 Pista: Creado para entretener a los visitantes de un laboratorio nuclear en 1958.", icon: "🎾" },
  { id: 6, year: 1962, decade: "1960s", title: "Spacewar! (PDP-1 en el MIT)", desc: "Steve Russell y su equipo crean Spacewar!, el primer duelo espacial computarizado en la PDP-1.", hint: "💡 Pista: Desarrollado por hackers universitarios del MIT a principios de los 60s (1962).", icon: "🚀" },
  { id: 7, year: 1967, decade: "1960s", title: "Prototipo 'Brown Box' (Ralph Baer)", desc: "Ralph Baer, el 'Padre de los Videojuegos', desarrolla el prototipo funcional de consola casera 'Brown Box'.", hint: "💡 Pista: Nace el concepto de conectar consolas a televisores domésticos a finales de los 60s.", icon: "📦" },
  { id: 8, year: 1971, decade: "1970s", title: "Computer Space (Nolan Bushnell)", desc: "Nolan Bushnell y Ted Dabney crean la primera máquina arcade comercial operada por monedas.", hint: "💡 Pista: Nacimiento de los videojuegos recreativos comerciales en 1971.", icon: "🕹️" },
  { id: 9, year: 1972, decade: "1970s", title: "Magnavox Odyssey & Atari Pong", desc: "Se lanza la Magnavox Odyssey (primera consola) y Atari conquista los salones arcade con Pong.", hint: "💡 Pista: El gran despegue comercial masivo de los videojuegos en 1972.", icon: "🏓" },
  { id: 10, year: 1977, decade: "1970s", title: "Atari 2600 (VCS)", desc: "Atari lanza la consola Atari 2600 impulsando el mercado de cartuchos intercambiables en los hogares.", hint: "💡 Pista: Consola icónica con palanca de madera lanzada en 1977.", icon: "🕹️" },
  { id: 11, year: 1978, decade: "1970s", title: "Space Invaders (Taito)", desc: "Taito lanza Space Invaders, causando un fenómeno cultural masivo y escasez de monedas de 100 yenes en Japón.", hint: "💡 Pista: El mítico juego de alienígenas que invadió las arcades en 1978.", icon: "👾" },
  { id: 12, year: 1980, decade: "1980s", title: "Pac-Man (Namco)", desc: "Toru Iwatani diseña Pac-Man para Namco, convirtiéndose en un ícono global de la cultura pop.", hint: "💡 Pista: El comecocos amarillo debutó abriendo la dorada década de los 80s (1980).", icon: "🟡" },
  { id: 13, year: 1981, decade: "1980s", title: "Donkey Kong (Nintendo)", desc: "Shigeru Miyamoto crea Donkey Kong en arcade, presentando al mundo a Jumpman (Mario).", hint: "💡 Pista: Debut de Mario y primera obra maestra de Miyamoto en 1981.", icon: "🦍" },
  { id: 14, year: 1983, decade: "1980s", title: "Colapso del Videojuego de 1983", desc: "La industria norteamericana sufre una severa recesión por sobreoferta de juegos de baja calidad.", hint: "💡 Pista: La famosa gran crisis que sepultó cartuchos en el desierto en 1983.", icon: "💥" },
  { id: 15, year: 1985, decade: "1980s", title: "NES & Super Mario Bros", desc: "Nintendo revive la industria con el lanzamiento norteamericano de la NES y Super Mario Bros.", hint: "💡 Pista: El fontanero rescató la industria casera en 1985.", icon: "🍄" },
  { id: 16, year: 1989, decade: "1980s", title: "Game Boy & Tetris", desc: "Nintendo lanza la portátil Game Boy junto al adictivo juego de acertijos Tetris.", hint: "💡 Pista: Revolución del juego portátil a finales de los 80s (1989).", icon: "📟" },
  { id: 17, year: 1991, decade: "1991s", decadeReal: "1990s", title: "Sonic the Hedgehog (Sega)", desc: "Sega presenta a Sonic para rivalizar directamente con Nintendo en la era de los 16-bits.", hint: "💡 Pista: El erizo azul superveloz nació a principios de los 90s (1991).", icon: "🦔" },
  { id: 18, year: 1993, decade: "1990s", title: "Doom (id Software)", desc: "id Software lanza Doom, popularizando los juegos de disparos en primera persona (FPS) y redes LAN.", hint: "💡 Pista: El rey de los FPS 3D sangrientos de 1993.", icon: "🔫" },
  { id: 19, year: 1994, decade: "1990s", title: "Sony PlayStation", desc: "Sony entra en la industria lanzando la PlayStation, masificando los gráficos 3D en CD-ROM.", hint: "💡 Pista: La consola gris de Sony que dominó mediados de los 90s (1994/95).", icon: "💿" },
  { id: 20, year: 1996, decade: "1990s", title: "Nintendo 64 & Super Mario 64", desc: "Nintendo lanza la N64 definiendo para siempre los estándares del movimiento 3D con camara libre.", hint: "💡 Pista: Revolución tridimensional de 64 bits en 1996.", icon: "⭐" },
  { id: 21, year: 2000, decade: "2000s", title: "Sony PlayStation 2", desc: "Sony lanza la PS2, la consola hogareña más vendida de todos los tiempos que incluía DVD.", hint: "💡 Pista: Dio la bienvenida al nuevo milenio en el año 2000.", icon: "🖤" },
  { id: 22, year: 2001, decade: "2000s", title: "Microsoft Xbox & Halo", desc: "Microsoft debuta en las consolas con Xbox, incorporando puerto Ethernet y disco duro integrado.", hint: "💡 Pista: Debut del Jefe Maestro y la marca Xbox en 2001.", icon: "🟢" },
  { id: 23, year: 2004, decade: "2000s", title: "World of Warcraft (Blizzard)", desc: "Blizzard lanza WoW, estableciendo el estándar de oro para los juegos de rol multijugador masivos (MMORPG).", hint: "💡 Pista: El fenómeno de Azeroth que atrapó a millones a mediados de los 2000s (2004).", icon: "⚔️" },
  { id: 24, year: 2006, decade: "2000s", title: "Nintendo Wii", desc: "Nintendo revoluciona el mercado casual con la Wii y sus innovadores controles por movimiento.", hint: "💡 Pista: El Wiimote que puso a jugar bowling a toda la familia en 2006.", icon: "🎾" },
  { id: 25, year: 2007, decade: "2000s", title: "iPhone & Gaming Móvil", desc: "El lanzamiento del iPhone cataliza la era moderna de los videojuegos móviles y pantallas táctiles.", hint: "💡 Pista: El inicio del boom de aplicaciones y juegos de bolsillo en 2007.", icon: "📱" },
  { id: 26, year: 2011, decade: "2010s", title: "Minecraft (Mojang)", desc: "Mojang lanza oficialmente Minecraft, convirtiéndose en el videojuego más vendido de la historia.", hint: "💡 Pista: El mundo infinito de bloques creado por Notch en 2011.", icon: "⛏️" },
  { id: 27, year: 2013, decade: "2010s", title: "Lanzamiento de PS4, Xbox One & GTA V", desc: "Se estrena la octava generación de consolas junto al lanzamiento histórico de GTA V.", hint: "💡 Pista: Un año récord en ventas y lanzamientos masivos (2013).", icon: "🚗" },
  { id: 28, year: 2016, decade: "2010s", title: "Pokémon GO (Niantic)", desc: "Niantic y The Pokémon Company sacan a millones a las calles con el fenómeno de realidad aumentada.", hint: "💡 Pista: Verano viral de cazar pokémones en las calles en 2016.", icon: "🔴" },
  { id: 29, year: 2017, decade: "2010s", title: "Nintendo Switch & Fortnite", desc: "Nintendo presenta su consola híbrida Switch mientras Epic Games revoluciona con el Battle Royale Fortnite.", hint: "💡 Pista: El gran año del gaming híbrido y los bailes virales (2017).", icon: "🎮" },
  { id: 30, year: 2020, decade: "2020s", title: "Gaming en Pandemia (Animal Crossing & Among Us)", desc: "El confinamiento mundial impulsa juegos sociales de convivencia y deducción como Animal Crossing y Among Us.", hint: "💡 Pista: Eventos del inicio de la década de 2020 durante la cuarentena.", icon: "😷" },
  { id: 31, year: 2021, decade: "2020s", title: "Hades gana un Premio Hugo", desc: "El roguelike Hades se convierte en el primer videojuego en la historia en recibir un prestigioso Premio Hugo de literatura.", hint: "💡 Pista: Reconocimiento literario para los videojuegos en 2021.", icon: "🏛️" },
  { id: 32, year: 2022, decade: "2020s", title: "The New York Times adquiere Wordle", desc: "El fenómeno viral diario de acertijos de palabras Wordle es comprado por The New York Times.", hint: "💡 Pista: Fiebre de los 5 cuadritos verdes comprados por un periódico en 2022.", icon: "🟩" },
  { id: 33, year: 2023, decade: "2020s", title: "Adaptaciones de The Last of Us & Super Mario Movie", desc: "Los videojuegos dominan Hollywood con la aclamada serie de HBO y la taquillera película animada.", hint: "💡 Pista: El gran éxito de los videojuegos en cine y TV de 2023.", icon: "🎬" },
  { id: 34, year: 2024, decade: "2020s", title: "Astro Bot (PlayStation)", desc: "Lanzamiento del aclamado juego de plataformas Astro Bot rindiendo homenaje a la historia de los videojuegos.", hint: "💡 Pista: Celebración de la historia de PlayStation en 2024.", icon: "🤖" }
];

// Decadas soportadas en la línea de tiempo
const DECADES = ["1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

// STATE MANAGEMENT
let gameState = {
  studentName: "",
  studentId: "",
  deck: [],
  currentCardIndex: 0,
  xp: 0,
  streak: 0,
  totalPlaced: 0,
  firstAttemptCorrect: 0,
  totalAttempts: 0,
  startTime: null,
  timerInterval: null,
  placedCardsByDecade: {},
  firstAttemptMap: {} // cardId -> boolean
};

// SIMULATED / LOCALSTORAGE DATA FOR TEACHER DASHBOARD
let telemetryStore = JSON.parse(localStorage.getItem('telemetryStore') || "[]");

// Initial mock data if store is empty
if (telemetryStore.length === 0) {
  telemetryStore = [
    { studentName: "Valeria Ríos", studentId: "EST-104", scoreXP: 3400, totalCorrect: 28, errors: 3, accuracyPct: 90.3, avgSpeedSec: 3.4, timeElapsedSec: 110, timestamp: "22:45" },
    { studentName: "Mateo Silva", studentId: "EST-209", scoreXP: 2900, totalCorrect: 24, errors: 7, accuracyPct: 77.4, avgSpeedSec: 4.1, timeElapsedSec: 135, timestamp: "22:48" },
    { studentName: "Camila Torres", studentId: "EST-315", scoreXP: 3800, totalCorrect: 30, errors: 1, accuracyPct: 96.7, avgSpeedSec: 2.8, timeElapsedSec: 95, timestamp: "22:52" }
  ];
  localStorage.setItem('telemetryStore', JSON.stringify(telemetryStore));
}

/* ==========================================================================
   WEB AUDIO API - SYNTHESIZER FOR RETRO SFX
   ========================================================================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'success') {
    // Upward chiptune arpeggio
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'hint') {
    // Gentle warning tone for hints (no punishment sound)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.setValueAtTime(293.66, now + 0.12); // D4
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'victory') {
    // Fanfare sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.15);
    osc.frequency.setValueAtTime(659.25, now + 0.3);
    osc.frequency.setValueAtTime(880, now + 0.45);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

/* ==========================================================================
   INITIALIZATION & NAVIGATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initTimelineGrid();
  startDashboardPolling();
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

/* ==========================================================================
   STUDENT MINIGAME LOGIC
   ========================================================================== */

function handleStartGame(e) {
  e.preventDefault();
  const name = document.getElementById("inputStudentName").value.trim();
  const id = document.getElementById("inputStudentId").value.trim();

  if (!name || !id) return;

  gameState.studentName = name;
  gameState.studentId = id;

  // Hide modal
  document.getElementById("modalStudentRegister").classList.remove("modal-overlay--active");

  // Reset Game State
  gameState.deck = shuffleArray([...HISTORICAL_EVENTS]);
  gameState.currentCardIndex = 0;
  gameState.xp = 0;
  gameState.streak = 0;
  gameState.totalPlaced = 0;
  gameState.firstAttemptCorrect = 0;
  gameState.totalAttempts = 0;
  gameState.startTime = Date.now();
  gameState.placedCardsByDecade = {};
  gameState.firstAttemptMap = {};

  DECADES.forEach(d => gameState.placedCardsByDecade[d] = []);

  updateHud();
  renderTimelineSlots();
  renderActiveCard();

  // Start Timer
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(updateTimerDisplay, 1000);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateHud() {
  document.getElementById("hudXp").textContent = `${gameState.xp} XP`;
  document.getElementById("hudStreak").textContent = `${gameState.streak}x`;
  document.getElementById("hudProgress").textContent = `${gameState.totalPlaced} / ${HISTORICAL_EVENTS.length}`;
}

function updateTimerDisplay() {
  if (!gameState.startTime) return;
  const elapsedSec = Math.floor((Date.now() - gameState.startTime) / 1000);
  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(elapsedSec % 60).padStart(2, '0');
  document.getElementById("hudTimer").textContent = `${mins}:${secs}`;
}

// Render active card at top arena
function renderActiveCard() {
  const container = document.getElementById("cardDeckContainer");
  container.innerHTML = "";

  if (gameState.currentCardIndex >= gameState.deck.length) {
    // Game completed!
    finishGame();
    return;
  }

  const cardData = gameState.deck[gameState.currentCardIndex];

  const cardEl = document.createElement("div");
  cardEl.className = "event-card";
  if (cardData.showHint) {
    cardEl.classList.add("event-card--hint");
  }
  cardEl.draggable = true;
  cardEl.id = `activeCard-${cardData.id}`;

  cardEl.innerHTML = `
    <div class="event-card__header">
      <span class="event-card__badge">${cardData.icon} EVENTO HISTÓRICO</span>
      <span style="font-size: 0.8rem; color: var(--color-text-muted);">#${gameState.currentCardIndex + 1}</span>
    </div>
    <div class="event-card__title">${cardData.title}</div>
    <div class="event-card__description">${cardData.desc}</div>
    ${cardData.showHint ? `
      <div class="event-card__hint-box">
        <span class="event-card__hint-box-icon">💡</span>
        <div><strong>Retroalimentación:</strong> ${cardData.hint}</div>
      </div>
    ` : ''}
  `;

  // Drag listeners
  cardEl.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", cardData.decade);
    cardEl.classList.add("event-card--dragging");
  });

  cardEl.addEventListener("dragend", () => {
    cardEl.classList.remove("event-card--dragging");
  });

  container.appendChild(cardEl);
}

// Build Timeline Decades Grid (1940s - 2020s)
function initTimelineGrid() {
  const grid = document.getElementById("timelineGrid");
  grid.innerHTML = "";

  DECADES.forEach(decade => {
    const slot = document.createElement("div");
    slot.className = "decade-slot";
    slot.dataset.decade = decade;

    slot.innerHTML = `
      <div class="decade-slot__header">${decade}</div>
      <div class="decade-slot__cards-list" id="slotList-${decade}"></div>
    `;

    // Click handler for accessibility / mobile
    slot.addEventListener("click", () => handlePlaceCard(decade));

    // Drag & Drop handlers
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("decade-slot--drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("decade-slot--drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("decade-slot--drag-over");
      handlePlaceCard(decade);
    });

    grid.appendChild(slot);
  });
}

function renderTimelineSlots() {
  DECADES.forEach(decade => {
    const listEl = document.getElementById(`slotList-${decade}`);
    if (!listEl) return;
    listEl.innerHTML = "";

    const cards = gameState.placedCardsByDecade[decade] || [];
    cards.forEach(card => {
      const item = document.createElement("div");
      item.className = "placed-card";
      item.innerHTML = `
        <span class="placed-card__year">${card.year}</span>
        <span class="placed-card__title">${card.title}</span>
      `;
      listEl.appendChild(item);
    });
  });
}

/* CORE PEDAGOGIC EVALUATION (Continuous Feedback vs. Harsh Judgment) */
function handlePlaceCard(selectedDecade) {
  if (gameState.currentCardIndex >= gameState.deck.length) return;

  const currentCard = gameState.deck[gameState.currentCardIndex];
  gameState.totalAttempts++;

  // Track if this is 1st attempt for this specific card
  if (gameState.firstAttemptMap[currentCard.id] === undefined) {
    gameState.firstAttemptMap[currentCard.id] = (selectedDecade === currentCard.decade);
  }

  if (selectedDecade === currentCard.decade) {
    // SUCCESS!
    playSynthSound('success');

    // XP calculation: 100 base + streak bonus
    const streakBonus = gameState.streak * 20;
    const gainedXp = 100 + streakBonus;
    gameState.xp += gainedXp;
    gameState.streak++;
    gameState.totalPlaced++;

    if (gameState.firstAttemptMap[currentCard.id]) {
      gameState.firstAttemptCorrect++;
    }

    // Place card in decade rack
    gameState.placedCardsByDecade[selectedDecade].push(currentCard);
    renderTimelineSlots();

    // Advance to next card
    gameState.currentCardIndex++;
    updateHud();
    renderActiveCard();

  } else {
    // INCORRECT DECADE - FORMATIVE HINT FEEDBACK (NO PUNISHMENT)
    playSynthSound('hint');
    gameState.streak = 0; // Reset streak, but DO NOT subtract XP or fail student

    // Mark hint as active on this card
    currentCard.showHint = true;

    // Requeue card to end of deck so student gets another attempt to learn!
    const failedCard = gameState.deck.splice(gameState.currentCardIndex, 1)[0];
    gameState.deck.push(failedCard);

    updateHud();
    renderActiveCard();
  }
}

/* ==========================================================================
   END OF GAME DIAGNOSTIC & WEBHOOK TELEMETRY
   ========================================================================== */
function finishGame() {
  clearInterval(gameState.timerInterval);
  playSynthSound('victory');

  const totalTimeSec = Math.max(1, Math.floor((Date.now() - gameState.startTime) / 1000));
  const accuracyPct = Math.round((gameState.firstAttemptCorrect / HISTORICAL_EVENTS.length) * 100);
  const avgSpeedSec = parseFloat((totalTimeSec / gameState.totalAttempts).toFixed(1));

  // Render Diagnostic Modal
  document.getElementById("diagAccuracy").textContent = `${accuracyPct}%`;
  document.getElementById("diagAccuracySub").textContent = `${gameState.firstAttemptCorrect} de ${HISTORICAL_EVENTS.length} al primer intento`;
  document.getElementById("diagSpeed").textContent = `${avgSpeedSec}s`;
  document.getElementById("diagTotalXp").textContent = `⚡ ${gameState.xp} XP Acumulados`;

  let msg = "";
  if (accuracyPct >= 85) {
    msg = "🌟 ¡Extraordinario dominio histórico y excelente velocidad de decisión!";
  } else if (accuracyPct >= 60) {
    msg = "👍 ¡Buen desempeño! Has utilizado las pistas de manera efectiva para aprender.";
  } else {
    msg = "💡 ¡Gran demostración de perseverancia! El ensayo y error ha reforzado tu aprendizaje.";
  }
  document.getElementById("diagFeedbackMessage").textContent = msg;

  // Open Modal
  document.getElementById("modalDiagnostic").classList.add("modal-overlay--active");

  // Construct Telemetry JSON Payload
  const telemetryData = {
    studentName: gameState.studentName,
    studentId: gameState.studentId,
    scoreXP: gameState.xp,
    totalCorrect: gameState.firstAttemptCorrect,
    errors: gameState.totalAttempts - HISTORICAL_EVENTS.length,
    accuracyPct: accuracyPct,
    avgSpeedSec: avgSpeedSec,
    timeElapsedSec: totalTimeSec,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Save to local store for live dashboard
  telemetryStore.push(telemetryData);
  localStorage.setItem('telemetryStore', JSON.stringify(telemetryStore));

  // ASYNC FETCH (POST) TO WEBHOOK_URL
  sendWebhookTelemetry(telemetryData);
}

async function sendWebhookTelemetry(payload) {
  if (!WEBHOOK_URL) {
    console.log("ℹ️ WEBHOOK_URL está vacía. Telemetría guardada localmente para el Dashboard en Vivo.");
    return;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("✅ Telemetría enviada con éxito al Webhook:", response.status);
  } catch (err) {
    console.warn("⚠️ No se pudo enviar la telemetría al Webhook (servidor offline o URL inválida). Fallback local activo.", err);
  }
}

function restartGame() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  document.getElementById("modalStudentRegister").classList.add("modal-overlay--active");
}

function closeDiagnosticAndGoDashboard() {
  document.getElementById("modalDiagnostic").classList.remove("modal-overlay--active");
  switchView('teacher');
}

/* ==========================================================================
   TEACHER LIVE DASHBOARD ENGINE (HTTP POLLING)
   ========================================================================== */

function startDashboardPolling() {
  // Initial render
  renderTeacherDashboard();

  // HTTP Polling every 5 seconds
  setInterval(async () => {
    if (WEBHOOK_URL) {
      try {
        const res = await fetch(WEBHOOK_URL, { method: 'GET' });
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData)) {
            telemetryStore = remoteData;
          }
        }
      } catch (e) {
        // Fallback to local store silently
      }
    }
    renderTeacherDashboard();
  }, 5000);
}

function renderTeacherDashboard() {
  const activeCount = telemetryStore.length;

  if (activeCount === 0) {
    document.getElementById("kpiActiveStudents").textContent = "0";
    document.getElementById("kpiAvgAccuracy").textContent = "0%";
    document.getElementById("kpiAvgTime").textContent = "0s";
    document.getElementById("leaderboardBody").innerHTML = `
      <tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">Sin datos de estudiantes aún. Usa 'Simular Estudiante' para probar.</td></tr>
    `;
    return;
  }

  // Calculate KPIs
  const totalAcc = telemetryStore.reduce((sum, item) => sum + item.accuracyPct, 0);
  const avgAcc = Math.round(totalAcc / activeCount);

  const totalTime = telemetryStore.reduce((sum, item) => sum + item.timeElapsedSec, 0);
  const avgTime = Math.round(totalTime / activeCount);

  document.getElementById("kpiActiveStudents").textContent = activeCount;
  document.getElementById("kpiAvgAccuracy").textContent = `${avgAcc}%`;
  document.getElementById("kpiAvgTime").textContent = `${avgTime}s`;

  // Sort Leaderboard: (1) Correct answers desc, (2) Total Time asc
  const sorted = [...telemetryStore].sort((a, b) => {
    if (b.totalCorrect !== a.totalCorrect) {
      return b.totalCorrect - a.totalCorrect;
    }
    return a.timeElapsedSec - b.timeElapsedSec;
  });

  // Render Table
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";

  sorted.forEach((student, idx) => {
    const rankClass = idx === 0 ? "student-badge__rank--1" : (idx === 1 ? "student-badge__rank--2" : (idx === 2 ? "student-badge__rank--3" : ""));
    const totalEvents = HISTORICAL_EVENTS.length;
    const successWidth = Math.min(100, Math.round((student.totalCorrect / totalEvents) * 100));
    const dangerWidth = Math.max(0, 100 - successWidth);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="student-badge">
          <div class="student-badge__rank ${rankClass}">${idx + 1}</div>
          <div class="student-badge__info">
            <span class="student-badge__name">${student.studentName}</span>
            <span class="student-badge__id">ID: ${student.studentId} • ${student.timestamp}</span>
          </div>
        </div>
      </td>
      <td style="font-family: var(--font-heading); color: var(--color-neon-yellow); font-weight: bold;">
        ⚡ ${student.scoreXP} XP
      </td>
      <td style="min-width: 180px;">
        <div class="progress-bar">
          <div class="progress-bar__fill--success" style="width: ${successWidth}%;"></div>
          <div class="progress-bar__fill--danger" style="width: ${dangerWidth}%;"></div>
        </div>
        <div class="progress-bar__text">
          <span>${student.totalCorrect} aciertos</span>
          <span>${student.accuracyPct}% prec.</span>
        </div>
      </td>
      <td style="font-family: var(--font-heading); color: var(--color-neon-cyan);">
        ${student.avgSpeedSec}s/tarjeta
      </td>
      <td style="font-family: var(--font-heading); color: #fff;">
        ${student.timeElapsedSec}s
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// SIMULATOR BUTTON FOR CLASSROOM DEMOS
function simulateStudentSubmission() {
  const sampleNames = ["Gabriel Medina", "Elena Rostova", "Lucas Paz", "Sofia Chen", "Diego Alarcón"];
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const id = `EST-${Math.floor(100 + Math.random() * 900)}`;

  const totalCorrect = Math.floor(20 + Math.random() * 14); // 20 to 34
  const accuracyPct = Math.round((totalCorrect / HISTORICAL_EVENTS.length) * 100);
  const timeElapsedSec = Math.floor(80 + Math.random() * 80);
  const avgSpeedSec = parseFloat((timeElapsedSec / HISTORICAL_EVENTS.length).toFixed(1));
  const scoreXP = totalCorrect * 100 + Math.floor(Math.random() * 800);

  const mockPayload = {
    studentName: name,
    studentId: id,
    scoreXP: scoreXP,
    totalCorrect: totalCorrect,
    errors: HISTORICAL_EVENTS.length - totalCorrect,
    accuracyPct: accuracyPct,
    avgSpeedSec: avgSpeedSec,
    timeElapsedSec: timeElapsedSec,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  telemetryStore.push(mockPayload);
  localStorage.setItem('telemetryStore', JSON.stringify(telemetryStore));
  renderTeacherDashboard();
}
