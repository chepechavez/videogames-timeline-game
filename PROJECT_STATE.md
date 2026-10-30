# 🕹️ Videogames Timeline Game — Project State & Handoff

> **Documento de Referencia Viva (Single Source of Truth)**  
> Este documento se actualiza en **cada actualización del repositorio** para mantener sincronizado el contexto entre los dos equipos de trabajo.  
> **Última actualización:** 30 de octubre de 2026 (Versión de caché `v=12.1`)  
> **Rama principal:** `main` | **Repositorio:** `https://github.com/chepechavez/videogames-timeline-game.git`  
> **Despliegue activo:** GitHub Pages (`https://chepechavez.github.io/videogames-timeline-game/`)

---

## 📌 1. Visión General del Proyecto

**Videogames Timeline Game** es una aplicación web educativa interactiva inspirada en las reglas oficiales del juego de mesa *Timeline*. Los estudiantes compiten en equipos colocando cronológicamente en una línea de tiempo común 74 hitos históricos fundamentales de la industria de los videojuegos (desde 1940 con la Computadora Nim hasta 2024 con Astro Bot), utilizando información e imágenes de archivo de *The Strong National Museum of Play*.

### Modos de Uso:
1. **Modo Proyector de Aula (1 Pantalla):** Una sola pantalla central visible para todo el salón; los equipos juegan por turnos de forma presencial.
2. **Modo Multijugador Online (Multi-dispositivo):** Hasta 500 estudiantes conectados en tiempo real desde sus propios dispositivos con sincronización en vivo mediante Supabase Realtime (WebSockets Broadcast).

---

## 🛠️ 2. Stack Tecnológico & Arquitectura

* **Frontend:** Vanilla JavaScript (ES6+), HTML5 semántico y CSS3 moderno (arquitectura BEM, variables CSS y diseño responsive con modales desplazables `max-height: 92vh`).
* **Estilo Visual:** Cyberpunk / Retro Arcade, tipografía Google Fonts (*Orbitron* y *Rajdhani*), paleta de neón (Cian, Magenta, Amarillo, Verde lima) con filtro CRT retro.
* **Audio:** Efectos de sonido retro sintetizados nativos con `Web Audio API` (`playSynthSound`: `tick`, `success`, `error`, `victory`), sin archivos MP3 externos.
* **Despliegue:** 100% estático y funcional en producción vía GitHub Pages. Sin `node_modules` ni paso de compilación.
* **Backend / Sincronización:** Supabase Realtime Client v2 (`@supabase/supabase-js@2` vía CDN) para broadcast de eventos en tiempo real entre docente y estudiantes.
* **Datos Históricos:** 74 eventos catalogados en `Videogames - Timeline.md` y compilados en `app.js`.

---

## 🗺️ 3. Estructura de Archivos del Repositorio

```text
videogames-timeline-game/
├── index.html               # Estructura DOM, modales (rol, lobby, espera + minitutorial, inspección, diagnóstico), HUD y KPIs (v=12.1)
├── app.js                   # Motor Timeline, validación de salas, sincronización completa Supabase Realtime y audio Web Audio API (v=12.1)
├── styles.css               # Sistema de diseño BEM, variables neón, layout responsive y estilos del minitutorial (v=12.1)
├── Videogames - Timeline.md # Catálogo fuente de los 74 eventos con imágenes oficiales
└── PROJECT_STATE.md         # (Este archivo) Estado actual del proyecto, historial y backlog
```

---

## 📊 4. Estado Actual de la Implementación (¿En qué está el proyecto?)

### ✅ Características Implementadas y Estables:

#### A. Mecánicas de Juego (*Timeline Rules*):
- [x] Barajado y reparto equitativo de cartas iniciales por equipo (2 equipos = 6 cartas, 3 equipos = 5 cartas, 4 equipos = 4 cartas).
- [x] Carta ancla inicial revelada en la mesa central.
- [x] Validación estricta de colocación cronológica (*Antes*, *Entre* o *Después*).
- [x] **Regla pedagógica de conservación de tarjeta en fallo (v12.1):** Cuando un equipo se equivoca, la tarjeta **no se retira de su mano** ni se revela su año exacto en el chat, permitiendo que el equipo deduzca y vuelva a intentarlo en un turno posterior (cediendo inmediatamente el turno actual).
- [x] **Cesión estricta de turno (Fix v12.0):** Independientemente de acierto, fallo o tiempo agotado, el turno **siempre** pasa al siguiente equipo. Sincronización completa de `currentRoundTurnCount`, `reserveDeck`, `teamTurnCounts`, `isTieBreakMode` y `tieBreakTeamIndices` mediante `buildGameSyncPayload()` / `applyIncomingGamePayload()`.
- [x] **Rotación justa de representantes por equipo (Fix v12.0):** Contador individual `teamTurnCounts` por equipo para que todos los integrantes de cada equipo roten equitativamente sin sesgo de paridad cuando se juega con 2 o 4 equipos.
- [x] Evaluación formal al cierre de ronda (igualdad de turnos jugados) y desempate en *muerte súbita* (*Sudden Death*).
- [x] Salto inteligente contabilizado de equipos que ya vaciaron su mano dentro de una ronda activa.
- [x] Reloj reglamentario unificado de **60 segundos por turno** (con alerta sonora `tick` en los últimos 5s y timeout autoritativo del docente a los 60s con respaldo en 62s).

#### B. Gestión de Salas Online, Roles y Sala de Espera:
- [x] **Validación obligatoria de sala creada por el profesor (Fix v12.0):**
  - Los estudiantes **solo pueden entrar a salas que ya hayan sido abiertas por el docente** (`isRoomHostActive = true`).
  - Handshake en tiempo real `check_room_exists` → `room_exists_ack` al pulsar *"Entrar a la Sala de Espera"*.
  - Si la sala no existe aún, se bloquea el acceso en 3.2s mostrando aviso claro en pantalla sin dejar al alumno en una sala fantasma.
  - Si el profesor cierra o reconfigura el lobby antes de iniciar, se emite `room_closed` devolviendo limpiamente a los alumnos en espera al formulario de ingreso, y `cleanupRealtimeChannel()` libera canales previos sin fugas.
  - Heartbeat ligero en lobby (cada 4s hasta recibir confirmación de equipo y arranque) + reconexión transparente (`student_reconnected`) si un alumno registrado recarga el navegador en plena partida.
- [x] **Mini-Tutorial Visual en Sala de Espera (Feature v12.0):**
  - Integrado en `#modalStudentWaiting` mientras los estudiantes aguardan el inicio de la partida.
  - Incluye esquema visual de inserción cronológica (`[ + ] Antes` — `1972 Pong` — `[ + ] 👈 Tu Carta` — `1985 NES` — `[ + ] Después`) y las 4 reglas clave, destacando explícitamente el **límite de 60 segundos por turno** y la cesión obligatoria del turno.
- [x] **Rol Profesor / Tablero General:**
  - Código de sala personalizable, lobby en vivo con conteo y distribución automática de equipos, tablero con 4 KPIs dinámicos, leaderboard y ranking de cartas con más errores.

#### C. Audio, Efectos Visuales y Despliegue:
- [x] Sintetizador retro con `Web Audio API`, partículas de confetti en canvas, popups de racha y overlay CRT.
- [x] Publicado y operativo en GitHub Pages con cache-busting `v=12.1`.

---

## 🎯 5. ¿Qué Sigue? (Backlog & Próximas Mejoras Opcionales)

1. **Pruebas en vivo de validación v12.1:**
   - Verificar en sesión real la rotación estricta de turnos, la conservación de tarjeta al fallar para reintentar, el bloqueo de ingreso previo a crear la sala y el mini-tutorial en celulares.
2. **Exportación de Reporte Académico Docente (CSV):**
   - Botón opcional en el panel del profesor al finalizar la partida para descargar métricas por equipo e integrantes.
3. **Filtro de Épocas / Categorías Históricas:**
   - Opción en la configuración docente para elegir rangos históricos específicos (ej. *Orígenes 1940-1979*, *Era Clásica 1980-1999*, *Era Moderna 2000-2024* o *Mazo Completo*).
4. **Botón de Silenciar Audio (Mute Toggle):**
   - Control rápido en la cabecera para activar/silenciar los efectos sintetizados en el proyector o celulares.

---

## 🔄 6. Protocolo de Trabajo entre Dos Equipos (Handoff Workflow)

### 📤 Al Terminar en el Equipo Actual:
1. Actualizar `PROJECT_STATE.md` reflejando qué se hizo y qué queda pendiente.
2. Subir cambios a GitHub:
   ```bash
   git status
   git add .
   git commit -m "Descripción concisa del avance"
   git push origin main
   ```

### 📥 Al Iniciar en el Segundo Equipo:
1. Descargar últimos cambios:
   ```bash
   git pull origin main
   ```
2. Leer `PROJECT_STATE.md` para retomar con el contexto exacto.

---

## 📝 7. Registro de Últimos Commits Clave

| Commit / Versión | Descripción Resumida |
| :--- | :--- |
| `v12.1` *(actual)* | Ajusta regla de fallo para conservar la tarjeta en la mano del equipo (permitiendo reintentar sin revelar su año) y actualiza el mini-tutorial |
| `7115b0c` (`v12.0`) | Fix turnos consecutivos (sincronización completa de ronda, mazo y representantes por equipo), bloqueo de entrada a salas no creadas por el profesor y mini-tutorial con regla de 60s |
| `12030ec` | Docs: Creación inicial de `PROJECT_STATE.md` para trabajo entre dos equipos |
| `41139a4` | Secuenciación monotónica `turnSequence` y salto de equipos sin cartas |
| `626e476` | Limpieza de flechas redundantes del track de timeline |
| `a64e173` | Fix en KPI card 4 para conteo y serialización de cartas totales reveladas |
| `306e00a` | Sincronización global de fin de juego y validación estricta de turnos ajenos |
| `48b6726` | Unificación de temporizador en tiempo real entre todos los dispositivos |

---
*Recuerda actualizar este archivo en cada commit/push importante.*
