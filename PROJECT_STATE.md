# 🕹️ Videogames Timeline Game — Project State & Handoff

> **Documento de Referencia Viva (Single Source of Truth)**  
> Este documento se actualiza en **cada actualización del repositorio** para mantener sincronizado el contexto entre los dos equipos de trabajo.  
> **Última actualización:** 2 de noviembre de 2026 (Versión de caché `v=12.4`)  
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
├── index.html               # Estructura DOM, modales (rol, lobby, espera + minitutorial, validación equipos vacíos, confirmación salida, detalle 2 columnas, resultados), HUD y KPIs (v=12.4)
├── app.js                   # Motor Timeline, confirmación salida sin retorno, controles docentes unificados, estado dinámico del tablero, sincronización Supabase y audio (v=12.4)
├── styles.css               # Sistema de diseño BEM, variables neón, layout responsive, modal histórico 2 columnas sin recorte y clasificación final (v=12.4)
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
- [x] Salto inteligente contabilizado de equipos que ya vaciaron su mano o que quedaron sin integrantes conectados dentro de una ronda activa.
- [x] Reloj reglamentario unificado de **60 segundos por turno** (con alerta sonora `tick` en los últimos 5s y timeout autoritativo del docente a los 60s con respaldo en 62s).

#### B. Gestión de Salas Online, Roles y Sala de Espera:
- [x] **Prevención de Salas/Equipos Vacíos y Salto de Turnos Sin Jugador (Fix & Feature v12.3):**
  - **Mínimo 2 estudiantes para iniciar:** En modo **Multijugador Online** se exige un mínimo de 2 estudiantes conectados para iniciar partida (en revancha, si quedan menos de 2 estudiantes conectados, el profesor puede reabrir la Sala de Espera con `return_to_lobby`). En modo **Proyector**, si el docente escribe nombres en la lista opcional, también se exige mínimo 2 nombres (si deja la lista vacía, se mantienen todos los equipos físicos configurados).
  - **Confirmación interactiva ante equipos vacíos (`#modalTeamValidation`):** Cuando hay menos estudiantes que equipos configurados (ej. 4 equipos y 3 estudiantes, 4 equipos y 2 estudiantes, o 3 equipos y 2 estudiantes — tanto en Lobby Online, Revancha como en Proyector con lista), el juego consulta al docente si desea **⏳ Esperar Estudiantes** (permaneciendo en el lobby/configuración) o **🚀 Iniciar con Reducción** (compactando automáticamente la partida solo a los equipos con integrantes y ajustando sus cartas iniciales reglamentarias: 3 equipos = 5 cartas, 2 equipos = 6 cartas).
  - **Omisión automática en 0s a mitad de partida:** Si todos los integrantes de un equipo abandonan la sala (`student_left`) durante una partida activa, sus turnos se omiten automáticamente en 0 segundos sin esperar el reloj de 60s (pasando el turno de inmediato si estaba activo; si aún queda otro integrante en ese equipo, se refresca el reloj para el compañero que asume el tiro; y si todos los alumnos abandonan la sala, la sesión finaliza limpiamente). Los equipos vacíos se identifican con badge `Sin integrantes` / `Turno omitido` y nunca superan ni empatan en clasificación final a equipos con integrantes activos.
  - **Botón docente `⏭️ Saltar Turno`:** Disponible en la barra de modo y en el Dashboard Profesor (online y pizarra) para saltar en 1 clic el turno actual —rotando además al siguiente representante del equipo para la próxima ronda— si un estudiante cierra el navegador o se ausenta sin salir formalmente.
- [x] **Validación obligatoria de sala creada por el profesor (Fix v12.0):**
  - Los estudiantes **solo pueden entrar a salas que ya hayan sido abiertas por el docente** (`isRoomHostActive = true`).
  - Handshake en tiempo real `check_room_exists` → `room_exists_ack` al pulsar *"Entrar a la Sala de Espera"*.
  - Si la sala no existe aún, se bloquea el acceso en 3.2s mostrando aviso claro en pantalla sin dejar al alumno en una sala fantasma.
  - Si el profesor cierra o reconfigura el lobby antes de iniciar, se emite `room_closed` devolviendo limpiamente a los alumnos en espera al formulario de ingreso, y `cleanupRealtimeChannel()` libera canales previos sin fugas.
  - Heartbeat ligero en lobby (cada 4s hasta recibir confirmación de equipo y arranque) + reconexión transparente (`student_reconnected`) si un alumno registrado recarga el navegador en plena partida.
- [x] **Mini-Tutorial Visual en Sala de Espera (Feature v12.0):**
  - Integrado en `#modalStudentWaiting` mientras los estudiantes aguardan el inicio de la partida.
  - Incluye esquema visual de inserción cronológica (`[ + ] Antes` — `1972 Pong` — `[ + ] 👈 Tu Carta` — `1985 NES` — `[ + ] Después`) y las 4 reglas clave, destacando explícitamente el **límite de 60 segundos por turno** y la cesión obligatoria del turno.
- [x] **Rol Profesor / Control de Partida y Tablero General:**
  - Código de sala personalizable, lobby en vivo con conteo y distribución automática de equipos, tablero con 4 KPIs dinámicos, leaderboard y ranking de cartas con más errores.
  - **Finalización Manual de Partida con Confirmación (Feature v12.2):** El profesor dispone del botón `🛑 Finalizar Partida` tanto en el modo **Multijugador Online** como en el modo **Proyector / Pizarra** (en la barra superior de modo y en el Dashboard Docente), protegido por un diálogo de confirmación (`#modalConfirmEndMatch`).
  - **Clasificación Final y Permanencia Inteligente en Sala (Feature v12.2):**
    - Al finalizar (por victoria natural o por cierre del docente), todos los dispositivos reciben en tiempo real el modal de resultados con tabla de clasificación por equipos (ordenada por *menos cartas restantes → mayor efectividad % → más aciertos*, determinando ganador o empate oficial), botón `🏆 Ver Resultados` para reabrirlo y exploración limpia de la línea de tiempo armada (sin ranuras `[ + ]`).
  - **Flujo post-partida híbrido y confirmación de salida sin retorno (`#modalConfirmExit`, Feature v12.4):** Por defecto, los estudiantes **permanecen conectados en la misma sala**, lo que permite al docente lanzar instantáneamente `🔄 NUEVA PARTIDA (MISMA SALA Y EQUIPOS)`. Cualquier acción que cierre definitivamente la sesión o sala actual (`🏠 Salir a Portada` en resultados o cabecera estudiantil, y `🔄 Cambiar Modo / Crear Partida` del docente) solicita confirmación explícita advirtiendo que no se podrá regresar a la línea de tiempo ni a los resultados actuales (manteniendo abierto el cuadro de resultados si se cancela).
  - **Unificación de controles docentes y estado dinámico del tablero (UX v12.4):** Se eliminaron los botones duplicados de la barra del Panel Docente y se ocultó `🏠 Salir a Portada` en la cabecera cuando el rol activo es Profesor, dejando un único punto de control en la barra superior de modo (`🔄 Cambiar Modo / Crear Partida`, que lleva directo a Configuración Docente, desde donde `🏠 Portada / Rol` permite cambiar de rol). Además, el texto fijo `"EN VIVO - Actualizando..."` se reemplazó por un indicador dinámico según el estado real (`Partida en curso • Sincronizado en tiempo real`, `Partida en curso • Ronda X`, `🏁 Partida finalizada • Resultados finales` o `⏳ Esperando inicio de partida`).
  - **Visualización completa en 2 columnas del detalle histórico (`#modalCardDetail`, Fix & UX v12.4):** El panel de información ampliada (`ℹ️`) muestra las ilustraciones verticales de *The Strong National Museum of Play* (`384×497 px`) completas sin recorte (`object-fit: contain`) en un diseño de 2 columnas en PC/tablet (imagen a la izquierda y año/título/historia a la derecha; apilado automáticamente en móvil).

#### C. Audio, Efectos Visuales y Despliegue:
- [x] Sintetizador retro con `Web Audio API`, partículas de confetti en canvas, popups de racha y overlay CRT.
- [x] Publicado y operativo en GitHub Pages con cache-busting `v=12.4`.

---

## 🎯 5. ¿Qué Sigue? (Backlog & Próximas Mejoras Opcionales)

1. **Pruebas en vivo de validación v12.3:**
   - Verificar en sesión real el flujo de confirmación/reducción ante equipos vacíos (4→3, 4→2, 3→2), el bloqueo con menos de 2 estudiantes, el salto automático en 0s si un equipo queda vacío en plena partida y el botón docente `⏭️ Saltar Turno`.
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
| `v12.4` *(actual)* | Añade confirmación de salida sin retorno (`#modalConfirmExit`), elimina botones duplicados del docente llevando `🔄 Cambiar Modo / Crear Partida` directo a Configuración Docente, reemplaza `"EN VIVO - Actualizando..."` por estado dinámico real y rediseña `#modalCardDetail` a 2 columnas con imagen vertical completa sin recorte |
| `95c39a9` (`v12.3`) | Corrige espera en equipos/salas vacías: exige mínimo 2 estudiantes, añade confirmación docente para esperar o reducir automáticamente equipos vacíos al iniciar (4→3, 4→2, 3→2 en online, revancha y proyector con lista), omite en 0s equipos vacíos a mitad de partida y añade botón docente `⏭️ Saltar Turno` |
| `c31bbcc` (`v12.2`) | Añade botón docente `🛑 Finalizar Partida` (online y pizarra) con modal de confirmación, tabla de clasificación final sincronizada y permanencia por defecto en la misma sala con opción de revancha inmediata o salir a portada |
| `5d43cb7` (`v12.1`) | Ajusta regla de fallo para conservar la tarjeta en la mano del equipo (permitiendo reintentar sin revelar su año) y actualiza el mini-tutorial |
| `7115b0c` (`v12.0`) | Fix turnos consecutivos (sincronización completa de ronda, mazo y representantes por equipo), bloqueo de entrada a salas no creadas por el profesor y mini-tutorial con regla de 60s |
| `12030ec` | Docs: Creación inicial de `PROJECT_STATE.md` para trabajo entre dos equipos |
| `41139a4` | Secuenciación monotónica `turnSequence` y salto de equipos sin cartas |
| `626e476` | Limpieza de flechas redundantes del track de timeline |
| `a64e173` | Fix en KPI card 4 para conteo y serialización de cartas totales reveladas |
| `306e00a` | Sincronización global de fin de juego y validación estricta de turnos ajenos |
| `48b6726` | Unificación de temporizador en tiempo real entre todos los dispositivos |

---
*Recuerda actualizar este archivo en cada commit/push importante.*
