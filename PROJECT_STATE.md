# 🕹️ Videogames Timeline Game — Project State & Handoff

> **Documento de Referencia Viva (Single Source of Truth)**  
> Diseñado para coordinar el desarrollo y mantener la continuidad del trabajo entre dos equipos de cómputo distintos.  
> **Última actualización:** 30 de octubre de 2026  
> **Rama principal:** `main` | **Repositorio:** `https://github.com/chepechavez/videogames-timeline-game.git`

---

## 📌 1. Visión General del Proyecto

**Videogames Timeline Game** es una aplicación web educativa interactiva inspirada en las reglas oficiales del juego de mesa *Timeline*. Los estudiantes compiten en equipos colocando cronológicamente en una línea de tiempo común 74 hitos históricos fundamentales de la industria de los videojuegos (desde 1940 con la Computadora Nim hasta 2024 con Astro Bot), utilizando información e imágenes de archivo de *The Strong National Museum of Play*.

### Modos de Uso Soportados:
1. **Modo Proyector de Aula (1 Pantalla):** Una sola pantalla visible para todo el salón; los equipos juegan por turnos de forma presencial.
2. **Modo Multijugador Online (Multi-dispositivo):** Hasta 500 estudiantes conectados en tiempo real desde sus propios dispositivos con sincronización en vivo mediante Supabase Realtime (WebSockets Broadcast & Presence).

---

## 🛠️ 2. Stack Tecnológico & Arquitectura

* **Frontend:** Vanilla JavaScript (ES6+), HTML5 semántico y CSS3 moderno (arquitectura BEM, variables CSS y diseño responsive).
* **Estilo Visual:** Cyberpunk / Retro Arcade, tipografía Google Fonts (*Orbitron* y *Rajdhani*), paleta de neón (Cian, Magenta, Amarillo, Verde lima) con filtro CRT retro opcional.
* **Sin dependencias pesadas ni bundler:** No requiere `node_modules`, Vite, Webpack ni proceso de compilación. Corre directo en cualquier navegador moderno o servidor local estático.
* **Backend / Sincronización:** Supabase Realtime Client v2 (`@supabase/supabase-js@2` cargado vía CDN) para broadcast de eventos de baja latencia entre el docente y los estudiantes.
* **Datos Históricos:** 74 eventos rigurosamente documentados en `app.js` y catalogados en `Videogames - Timeline.md`.

---

## 🗺️ 3. Estructura de Archivos del Repositorio

```text
videogames-timeline-game/
├── index.html               # Estructura DOM, modales de rol/lobby/inspección, HUD y KPIs
├── app.js                   # Lógica de juego, barajas, reglas Timeline, Supabase Realtime
├── styles.css               # Sistema de diseño, variables neón, layout flex/grid, animaciones
├── Videogames - Timeline.md # Catálogo fuente de los 74 eventos con imágenes oficiales
└── PROJECT_STATE.md         # (Este archivo) Estado actual, tareas y guía de sincronización
```

---

## 📊 4. Estado Actual de la Implementación (¿En qué está el proyecto?)

### ✅ Características Implementadas y Estables:

#### A. Mecánicas de Juego (*Timeline Rules*):
- [x] Barajado y reparto equitativo de cartas iniciales por equipo (configurable de 2 a 6 cartas).
- [x] Carta inicial revelada en la mesa central como punto de partida histórico.
- [x] Validación estricta de colocación cronológica (rango anterior, intermedio y posterior).
- [x] Mecánica oficial de error: si un equipo falla el año, la carta errónea se descarta y el equipo roba una nueva carta de penalización.
- [x] Evaluación formal de final de ronda: todos los equipos juegan el mismo número de turnos por ronda.
- [x] Sistema de desempate en *muerte súbita* (*Sudden Death*) en caso de que varios equipos vacíen su mano en la misma ronda.
- [x] Salto inteligente de turno: si un equipo ya se quedó sin cartas esperando el fin de ronda, el turno salta automáticamente a los equipos que aún tienen cartas pendientes.
- [x] Reloj de turno sincronizado en tiempo real (30 segundos por defecto, reseteable al colocar carta).

#### B. Roles y Gestión de Aula:
- [x] **Rol Profesor / Tablero General:**
  - Creación de código de sala personalizado (ej. `AULA-101`).
  - Sala de espera en vivo (*Lobby*) con listado y conteo de alumnos conectados en tiempo real.
  - Botón maestro del docente para iniciar partida y sincronizar a todos los clientes.
  - Tablero de KPIs analíticos en tiempo real:
    * *KPI 1:* Ronda activa y tamaño dinámico de mano del equipo.
    * *KPI 2:* Tiempo de respuesta del turno (promedio de partida vs mejor tiempo del equipo).
    * *KPI 3:* Precisión del equipo activo (% aciertos sobre intentos).
    * *KPI 4:* Total de cartas históricas reveladas sobre el total del mazo (74 cartas).
  - Modal para consultar rosters de integrantes de cada equipo en cualquier momento.
  - Selector de modo (Proyector vs Online).
- [x] **Rol Estudiante:**
  - Ingreso con nombre propio y código de sala.
  - Distribución equitativa y balanceada automática de equipos (Alfa, Beta, Gamma, Delta).
  - Modal con selección del jugador representante de cada equipo.
  - Banner dinámico interactivo de turno personal (*"¡Es tu turno de jugar!"* con retroalimentación visual).
  - Bloqueo de acciones fuera de turno para evitar jugadas desincronizadas.
  - Botón accesible para regresar a la portada o cambiar de rol en cualquier momento.

#### C. Sincronización en Red & Estabilidad:
- [x] Integración de canal Supabase Broadcast con secuenciación monotónica (`turnSequence`) para eliminar condiciones de carrera.
- [x] Sincronización unificada de fin de partida (*Game Over* y podio de ganadores).
- [x] Inspección detallada de cartas históricas con modal de alta resolución al hacer clic.
- [x] Cache-busting en llamadas de assets (`styles.css?v=11.0`) para evitar problemas de caché en navegadores de alumnos.

---

## 🎯 5. ¿Qué Sigue? (Backlog & Roadmap Priorizado)

A continuación se listan las tareas pendientes y mejoras sugeridas organizadas por prioridad:

### 🟡 Prioridad Alta (Próximos pasos inmediatos):
1. **Efectos de Sonido Retro (SFX):**
   - Incorporar sonidos 8-bit sintetizados (usando `Web Audio API` para evitar carga de archivos de audio externos):
     * Sonido de éxito al acertar año.
     * Sonido de fallo/error al errar posición.
     * Alerta de tiempo crítico (< 5 segundos).
     * Fanfarria de victoria y sonido de inicio de ronda.
   - Botón de silenciar/activar audio (Mute toggle) en el encabezado.
2. **Reconexión Automática de Alumnos:**
   - Si un estudiante recarga la página o pierde conexión WiFi temporalmente, restaurar automáticamente su `roomCode`, `playerName` y `userTeamId` desde `sessionStorage`/`localStorage` sin perder su lugar en el equipo.
3. **Despliegue Continuo (Deploy):**
   - Publicar el juego en GitHub Pages o Vercel para disponer de una URL pública permanente lista para ser compartida mediante código QR a los estudiantes en el aula.

### 🟢 Prioridad Media (Mejoras funcionales):
4. **Exportación de Reporte Académico Docente:**
   - Botón en el panel del profesor para descargar al final de la partida un resumen en CSV o PDF con el rendimiento de cada equipo (aciertos, fallos, tiempo promedio, integrantes).
5. **Selector de Paquetes / Categorías de Cartas:**
   - Permitir al profesor filtrar qué cartas usar por épocas (e.g. *Solo Era Dorada Arcade 1970-1989*, *Consolas Modernas 1990-2024* o *Todas las 74*).
6. **Optimización Táctil en Móviles:**
   - Ajustar el espaciado y tamaño de las cartas en pantallas pequeñas para facilitar la selección e inserción en la línea de tiempo sin necesidad de scroll horizontal excesivo.

### 🔵 Prioridad Baja (Nice to have):
7. **PWA (Progressive Web App):**
   - Añadir `manifest.json` y Service Worker para que en Modo Proyector pueda correr 100% offline si no hay internet en el salón de clases.

---

## 🔄 6. Protocolo de Trabajo entre Dos Equipos (Handoff Workflow)

Para evitar colisiones y asegurar una transición fluida al cambiar de computadora:

### 📤 Al Terminar en el Equipo Actual:
1. Revisa el estado de git:
   ```bash
   git status
   ```
2. Si realizaste cambios funcionales, actualiza brevemente este archivo `PROJECT_STATE.md` (sección 4 y 5).
3. Haz commit y push al repositorio remoto:
   ```bash
   git add .
   git commit -m "Descripción concisa del avance realizado"
   git push origin main
   ```

### 📥 Al Iniciar en el Segundo Equipo:
1. Asegúrate de tener los últimos cambios del repositorio:
   ```bash
   git pull origin main
   ```
2. Consulta este archivo `PROJECT_STATE.md` para refrescar en qué quedó la última sesión.
3. Levanta el entorno de pruebas local:
   - Con Python: `python -m http.server 8000` (abrir en navegador: `http://localhost:8000`)
   - O con la extensión **Live Server** de VS Code / Edge.
   - O abriendo directamente `index.html` en el navegador (para modo local/proyector).

---

## 📝 7. Registro de Últimos Commits Clave

| Commit | Descripción Resumida |
| :--- | :--- |
| `41139a4` | Corrige condición de carrera en turno multijugador y agrega salto inteligente de equipos sin cartas |
| `626e476` | Remueve flechas redundantes del track de timeline |
| `a64e173` | Fix en KPI card 4 para conteo y serialización de cartas totales reveladas |
| `306e00a` | Sincronización global de fin de juego y validación estricta de turnos ajenos |
| `48b6726` | Unificación de temporizador en tiempo real entre todos los dispositivos |
| `ddd3f36` | Sincronización en vivo del roster de integrantes de equipos controlada por el profesor |
| `a888874` | Sala de espera (*lobby*) en vivo, código de sala y control de inicio por docente |
| `4683005` | Configuración de credenciales de Supabase Realtime para multijugador |

---
*Mantén este documento siempre actualizado cada vez que concluyas una sesión de trabajo.*
