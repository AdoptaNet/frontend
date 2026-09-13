# DESIGN.md — Adoptanet

Especificación completa del diseño para reconstruirlo en código. Todos los valores
están extraídos del archivo de Figma; no hay nada aproximado.

**Fuente de verdad:** Figma, equipo "Tesis", archivo *Adoptanet — Sistema de diseño y mockups*
(`ueVc1VuGOt9uMPzG5cKjyR`). Tres páginas: guía de estilos, mockups móviles, mockups de escritorio.

Si el código y el Figma divergen, **gana el Figma** hasta que se decida lo contrario
por escrito en este archivo.

---

## 1. Tokens

### 1.1 Color

La paleta parte de dos referentes: el verde de los parques donde ocurre la mayoría
de los rescates y el ámbar del sol y la retama. **No se modifica.**

| Token | Hex | HSL | Uso |
|---|---|---|---|
| `verde-900` | `#0E2C25` | `166 52% 11%` | Texto sobre ámbar, fondos muy oscuros |
| `verde-700` | `#1D5147` | `168 47% 22%` | **Primario.** Navegación, acciones del rescatista |
| `verde-500` | `#2E7D6E` | `168 46% 33%` | Acentos, iconos activos, anillo de foco |
| `verde-200` | `#BFDCD4` | `164 30% 80%` | Siluetas, texto sobre verde oscuro |
| `verde-50`  | `#EDF5F2` | `157 29% 95%` | Superficie secundaria, fondos suaves |
| `ambar-700` | `#9A5D02` | `36 96% 31%` | Texto sobre ámbar claro |
| `ambar-500` | `#F0A202` | `40 98% 47%` | **Acento.** Afinidad y acción principal del adoptante |
| `ambar-100` | `#FCEBC9` | `40 89% 89%` | Fondo de las razones de compatibilidad |
| `azul-600`  | `#2C6E9B` | `205 56% 39%` | Estado: enviada |
| `azul-100`  | `#DCEAF3` | `205 51% 91%` | Fondo del estado enviada |
| `coral-600` | `#B94328` | `11 64% 44%` | Destructivo, error, rechazada |
| `coral-100` | `#F8DED8` | `12 62% 91%` | Fondo de error |
| `tinta-900` | `#14201C` | `160 23% 10%` | Texto principal |
| `tinta-600` | `#4B5A55` | `160 9% 32%` | Texto secundario |
| `tinta-400` | `#8A9793` | `162 6% 57%` | Texto tenue. Solo texto grande o elementos no textuales |
| `superficie`   | `#FFFFFF` | `0 0% 100%` | Tarjetas, campos |
| `superficie-2` | `#FAF9F6` | `40 27% 97%` | Superficie elevada alterna |
| `fondo`        | `#F5F3EE` | `43 26% 95%` | Fondo de pantalla |
| `atenuado`     | `#EFEDE7` | `45 20% 92%` | Cabeceras de tabla, campos deshabilitados |
| `linea`        | `#DEE4E1` | `160 12% 88%` | Bordes |
| `anillo`       | `#2E7D6E` | `168 46% 33%` | Foco |
| `esqueleto`    | `#E6E3DC` | `43 17% 88%` | Marcadores de carga |
| `verde-hover`  | `#153E36` | — | Hover del primario |
| `ambar-hover`  | `#D89102` | — | Hover del acento |

**Reglas de uso.** El ámbar se reserva para el sistema de recomendación y la acción
principal del adoptante; su escasez es lo que le da fuerza, y nunca hay dos botones
ámbar en la misma pantalla. El azul y el coral solo aparecen en estados del proceso,
jamás como color decorativo.

### 1.2 Contraste verificado

| Combinación | Ratio | Cumple |
|---|---|---|
| Tinta 900 sobre superficie | 14.8 : 1 | AA y AAA |
| Tinta 600 sobre superficie | 8.1 : 1 | AA y AAA |
| Blanco sobre verde 700 | 9.6 : 1 | AA y AAA |
| Blanco sobre verde 500 | 4.9 : 1 | AA en texto normal |
| Verde 900 sobre ámbar 500 | 7.4 : 1 | AA y AAA |
| Ámbar 700 sobre ámbar 100 | 5.2 : 1 | AA en texto normal |
| Tinta 400 sobre superficie | 3.0 : 1 | Solo texto grande o elementos no textuales |

### 1.3 Tipografía

Dos familias, ambas en Google Fonts, sin costo de licencia.

**Archivo** para títulos y nombres de animales: es una grotesca de trazo firme,
emparentada con la rotulación de cartelería. **Inter** para toda la interfaz de
lectura, porque el sistema muestra fichas densas en datos.

| Estilo | Familia | Peso | Tamaño / interlineado | Interletrado |
|---|---|---|---|---|
| Display | Archivo | 800 | 34 / 40 | −1.2 |
| Título 1 | Archivo | 700 | 24 / 30 | −0.5 |
| Título 2 | Archivo | 700 | 20 / 26 | −0.3 |
| Título 3 | Archivo | 600 | 17 / 23 | −0.1 |
| Cuerpo | Inter | 400 | 15 / 22 | 0 |
| Cuerpo fuerte | Inter | 500 | 15 / 22 | 0 |
| Menor | Inter | 400 | 13 / 19 | 0 |
| Menor fuerte | Inter | 500 | 13 / 19 | 0 |
| Etiqueta | Inter | 600 | 11 / 14 | +0.8, versalitas |
| Botón | Inter | 600 | 15 / 20 | 0 |

En la landing el Display sube a 78 px con interletrado −3.4 en escritorio y a 40 px
con −1.5 en móvil. Los titulares de sección van a 48 px con −1.8.

### 1.4 Espaciado y radios

Escala de 4: `4, 8, 12, 16, 20, 24, 32, 40`.

Margen lateral en móvil: **20**. En escritorio: **48**. Separación entre tarjetas: **12**
en móvil y **20** en escritorio.

Radios derivados de una base única, como `--radius` en shadcn:

| Token | px | Uso |
|---|---|---|
| `sm` | 6 | Elementos muy pequeños |
| `md` | 8 | Botones, campos, chips, alertas |
| `lg` | 10 | — |
| `xl` | 12 | Tarjetas y contenedores |
| `full` | 999 | Insignias y razones |

### 1.5 Elevación

```css
--elev-tarjeta:  0 1px 2px rgba(20,32,28,.05), 0 1px 3px rgba(20,32,28,.04);
--elev-boton:    0 1px 2px rgba(20,32,28,.08);
--elev-flotante: 0 4px 12px -2px rgba(20,32,28,.10), 0 2px 6px -2px rgba(20,32,28,.06);
```

La de tarjeta va en toda superficie blanca con borde. La flotante, en hojas
inferiores, avisos emergentes y la tarjeta destacada de la landing.

### 1.6 Iconografía

Rejilla de 24, trazo 2 px, extremos y uniones redondeados: la convención de lucide,
que es la biblioteca por defecto de shadcn. Se dibujan con trazo y no con relleno,
para que el mismo icono funcione sobre fondo claro y oscuro cambiando el color.

Set actual: corazón, lupa, documento, persona, rejilla, huella, calendario, mensaje,
filtro, más, cheque, alerta, atrás. La huella es la única de relleno, a propósito,
porque funciona como marca.

En producción: `lucide-react`. Los iconos dentro de un botón usan `data-icon` y
**no llevan clases de tamaño**: el componente resuelve el tamaño por CSS.

---

## 2. Componentes

### 2.1 Botón

Altura **46 px**, radio 8, separación interna de 8 entre icono y texto.

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| Primario | `ambar-500` | `verde-900` | — | Acción principal del adoptante |
| Secundario | `verde-700` | blanco | — | Gestión del rescatista |
| Contorno | blanco | `verde-700` | `linea` | Acción secundaria |
| Fantasma | transparente | `verde-700` | — | Acción terciaria |
| Destructivo | `coral-100` | `coral-600` | `coral-600` | Rechazar, eliminar |
| Enlace | transparente | `verde-700` | — | Subrayado en hover |

Cinco estados: normal, hover, foco, deshabilitado y cargando.

- **Hover:** el fondo pasa al tono `-hover`.
- **Foco:** anillo exterior de 2 px en `anillo`, separado 2 px.
- **Deshabilitado:** opacidad 50 % **sobre el color de la variante**, no un gris
  aparte. Así un botón ámbar deshabilitado sigue leyéndose como ámbar.
- **Cargando:** el botón no tiene propiedad propia de carga. Se compone con
  `Spinner` + `disabled`, según la regla de shadcn.

### 2.2 ToggleGroup

**Todo conjunto de 2 a 7 opciones excluyentes es un ToggleGroup.** Nunca un bucle
de botones con estado activo manual. Esto cubre el cuestionario completo, los
filtros, el registro de mascota y el reporte de seguimiento.

Altura 44, radio 8, padding 11/16. Estados: normal, hover, seleccionado (fondo
`verde-700`, texto blanco), foco (anillo 2 px) y deshabilitado (opacidad 50 %).

### 2.3 Field

Unidad de formulario con partes nombradas: `FieldLabel`, control, `FieldDescription`,
`FieldError`. Los campos se agrupan en `FieldGroup`; las preguntas con opciones, en
`FieldSet` con su `FieldLegend`.

La etiqueta va **siempre visible sobre el campo**, nunca dentro como marcador de
posición: al escribir, un placeholder desaparece y el usuario pierde la referencia.

Control: altura 48, radio 8, borde `linea` de 1 px. Foco: borde `anillo` y anillo de
2 px. Inválido: borde `coral-600`; se marca con `data-invalid` en el Field y
`aria-invalid` en el control. Deshabilitado: fondo `atenuado`, texto `tinta-400`.

### 2.4 Card

Composición completa, nunca todo dentro del contenido:
`CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`.

Fondo blanco, borde `linea` de 1 px, radio 12, elevación de tarjeta, padding 14 en
móvil y 20 a 24 en escritorio.

### 2.5 Razón de compatibilidad

**El componente central de la propuesta.** Píldora de fondo `ambar-100`, texto
`ambar-700`, punto de 8 px del mismo color, radio completo, padding 8/14/8/12.

Aparece bajo el rótulo «Te la recomendamos porque…», precedido de un `Separator`.
Cada razón corresponde a una variable del perfil del adoptante cruzada con un
atributo del animal.

> **Regla de producto:** el sistema **nunca** muestra un porcentaje de afinidad.
> Un número sin justificación no es evaluable por el adoptante ni auditable por el
> albergue. Si alguien propone mostrar el score, la respuesta es no.

En la ficha completa cada razón se expande con una línea que explica el cruce:
«Aguanta tus 6 h a solas — Tolera hasta 6 horas sin compañía sin desarrollar ansiedad».

### 2.6 Badge

Radio completo, padding 6/10, estilo Etiqueta. Siete estados: disponible, en proceso,
adoptada, enviada, en revisión, aprobada, rechazada. Color semántico fijo, jamás
decorativo.

### 2.7 Alert

Cuatro tonos: informativa, éxito, advertencia y error. Un solo patrón: icono, título
y descripción. Borde de 1 px con el lado izquierdo a 3 px, para que el significado no
dependa solo del color de fondo. Radio 8.

### 2.8 Empty

Partes: `EmptyMedia` (círculo de 72 con icono), `EmptyTitle`, `EmptyDescription`,
`EmptyContent`. **Toda pantalla vacía ofrece una acción concreta**; si no hay
recomendaciones, se explica qué falta del perfil y se enlaza al paso pendiente.

### 2.9 Skeleton

Reproduce la forma del contenido que viene, para que el salto visual al llegar los
datos sea mínimo. Fondo `esqueleto`, radio 6, pulso de 1.6 s. Nunca un indicador
giratorio genérico a pantalla completa.

### 2.10 Otros

- **Separator:** 1 px en `linea`. Es un elemento propio, no un borde del contenedor.
- **Spinner:** círculo de trazo 2 px con un cuarto transparente, en 16, 20 y 24.
- **Avatar:** círculo con iniciales. Siempre lleva fallback.
- **Foto de mascota:** marcador con silueta sobre `verde-50`, radio 12. En producción
  se sustituye por la imagen real de Cloudinary en WebP con recorte inteligente.

---

## 3. Principios

**Explicar, no puntuar.** Las razones concretas sustituyen al porcentaje.

**Área táctil de 48 px.** Todo elemento accionable la respeta, aunque su relleno
visual sea menor. El público incluye personas mayores y pantallas de gama baja.

**El dato difícil primero.** Las horas a solas, el espacio y los niños en casa se
preguntan antes que las preferencias estéticas, porque son las variables que más
predicen una devolución.

**Sin callejones sin salida.** Toda pantalla vacía o con error ofrece una salida.

### Desviaciones deliberadas respecto a shadcn

No son descuidos; documentarlas en la memoria de tesis.

| Desviación | Razón |
|---|---|
| Botón de 46 px en vez de `h-9` (36) | Área táctil para el público objetivo |
| Anillo de foco de 2 px en vez de `ring-1` | Criterio de apariencia de foco de WCAG 2.2 |
| Insignias como pastillas en vez de `rounded-md` | Comunican mejor «estado» que «etiqueta» |
| Alerta con borde izquierdo de 3 px | El significado no depende solo del color |

---

## 4. Responsive

Móvil primero. Marco de referencia: **390 × 844** en móvil, **1440 × 1024** en escritorio.

| Punto de corte | Comportamiento |
|---|---|
| `< 768px` | Una columna. Navegación inferior de 4 destinos. Filtros en hoja inferior. Listas como tarjetas apiladas. Cuestionario paso a paso con barra de progreso segmentada. |
| `≥ 768px` | Barra superior en lugar de navegación inferior. Contenido a 1440 máx. con margen de 48. |
| `≥ 1100px` | Filtros como lateral fijo. Recomendaciones en rejilla de 3 columnas. Listas de solicitudes y mascotas como tablas. Cuestionario con el progreso siempre visible en un panel lateral. Bandeja de solicitudes en dos paneles: lista a la izquierda, detalle a la derecha. |

Diferencia deliberada: **no existe pantalla de filtros en escritorio**, porque ahí
viven en el lateral fijo. Es la única de las 24 móviles sin equivalente directo.

---

## 5. Inventario de pantallas

45 pantallas en total. Cada una está etiquetada en Figma con las user stories que cubre.

### 5.1 Adoptante — móvil (17)

| ID | Pantalla | User stories |
|---|---|---|
| A1 | Bienvenida | US-01, US-03 |
| A2 | Elección de rol | US-01, US-02 |
| A3 | Iniciar sesión | US-03 |
| A4 | Recuperar contraseña | US-04 |
| A5 | Cuestionario 1 · Dónde vives | US-07, US-09 |
| A6 | Cuestionario 3 · Tu rutina | US-07, US-09 |
| A7 | Para ti (recomendaciones) | US-15, US-17, US-18 |
| A8 | Filtros (hoja inferior) | US-16 |
| A9 | Ficha de mascota | US-17, US-19 |
| A10 | Solicitud enviada | US-19 |
| A11 | Mis solicitudes | US-20, US-22 |
| A12 | Chat en tiempo real | US-23, US-24, US-25 |
| A13 | Perfil y ajustes | US-05, US-06, US-08 |
| A14 | Sin recomendaciones (perfil incompleto) | US-09, US-15 |
| A15 | Reporte de seguimiento | US-26 |
| A16 | Cargando recomendaciones | — |
| A17 | Error del recomendador | — |

### 5.2 Rescatista — móvil (6)

| ID | Pantalla | User stories |
|---|---|---|
| R1 | Panel del rescatista | US-29, US-31 |
| R2 | Registrar mascota | US-10, US-12 |
| R3 | Mis mascotas | US-11, US-13, US-14, US-29 |
| R4 | Detalle de solicitud | US-21, US-30 |
| R5 | Seguimiento · Pendientes | US-26, US-28 |
| R6 | Historial de seguimiento | US-27 |

### 5.3 Escritorio (20)

D1 Para ti · D2 Ficha · D3 Panel del rescatista · D4 Solicitudes recibidas ·
D5 Mensajes · D6 Bienvenida · D7 Elección de rol · D8 Iniciar sesión ·
D9 Recuperar contraseña · D10 Cuestionario 1 · D11 Cuestionario 3 ·
D12 Solicitud enviada · D13 Mis solicitudes · D14 Perfil · D15 Sin recomendaciones ·
D16 Reporte de seguimiento · D17 Registrar mascota · D18 Mis mascotas ·
D19 Seguimiento pendientes · D20 Historial de seguimiento.

Mismas user stories que sus equivalentes móviles.

### 5.4 Landing (2)

L1 escritorio y L2 móvil. Secciones: barra, héroe, problema, cómo funciona,
la diferencia, para albergues, preguntas frecuentes, cierre y pie.

El héroe es editorial: rótulo con regla, titular de 78 px, la palabra «encaja»
subrayada con una franja ámbar, tarjeta de muestra desplazada y girada −1.6°, una
retícula de puntos al 10 % de opacidad con degradado encima, y las cifras apoyadas
sobre una regla. La sección de problema es una lista numerada con separadores y
columnas de anchos distintos, no tres tarjetas iguales.

---

## 6. Navegación

### 6.1 Destinos

**Adoptante**, cuatro destinos: Para ti · Explorar · Solicitudes · Perfil.
En escritorio el cuarto es Mensajes y el perfil pasa al avatar.

**Rescatista**, cuatro destinos: Panel · Mascotas · Solicitudes · Seguimiento.

Máximo cuatro, con etiqueta de texto siempre visible: el icono solo no basta para un
público de alfabetización digital variada.

### 6.2 Mapa de rutas propuesto (Next.js App Router)

```
/                                  Landing                      L1 / L2
/ingresar                          Iniciar sesión               A3 / D8
/registro                          Crear cuenta                 A1 / D6
/registro/rol                      Elección de rol              A2 / D7
/recuperar                         Recuperar contraseña         A4 / D9

/app/cuestionario/[paso]           Cuestionario 1..4            A5, A6 / D10, D11
/app                               Para ti                      A7 / D1
/app/mascota/[id]                  Ficha                        A9 / D2
/app/mascota/[id]/solicitar        Solicitud enviada            A10 / D12
/app/solicitudes                   Mis solicitudes              A11 / D13
/app/mensajes                      Lista de conversaciones      D5
/app/mensajes/[roomId]             Chat                         A12 / D5
/app/perfil                        Perfil y ajustes             A13 / D14
/app/seguimiento/[adopcionId]      Reporte del adoptante        A15 / D16

/albergue                          Panel                        R1 / D3
/albergue/mascotas                 Catálogo propio              R3 / D18
/albergue/mascotas/nueva/[paso]    Registrar mascota            R2 / D17
/albergue/mascotas/[id]/editar     Editar ficha                 US-11
/albergue/solicitudes              Bandeja                      D4
/albergue/solicitudes/[id]         Detalle                      R4 / D4
/albergue/seguimiento              Pendientes                   R5 / D19
/albergue/seguimiento/[id]         Historial                    R6 / D20
```

### 6.3 Flujo del adoptante

```
Landing → Crear cuenta → Elección de rol → Cuestionario (4 pasos)
  → Para ti ⇄ Filtros
      → Ficha de mascota
          → Iniciar adopción → Solicitud enviada
              → Chat  ⇄  Mis solicitudes
                  → (aprobada, entrega)
                      → Reporte de seguimiento (30, 90, 180 días)
```

Estados alternos desde **Para ti**: cargando (A16), error del recomendador (A17)
y perfil incompleto (A14, que enlaza de vuelta al paso pendiente del cuestionario).

### 6.4 Flujo del rescatista

```
Landing → Crear cuenta → Elección de rol → Panel
  ├── Mascotas → Registrar (3 pasos) → Catálogo → Cambiar estado / Editar / Eliminar
  ├── Solicitudes → Detalle (perfil del adoptante + coincidencias)
  │       → Aprobar y abrir chat  |  Rechazar
  └── Seguimiento → Pendientes → Reenviar recordatorio / Registrar visita
                        → Historial de la mascota adoptada
```

### 6.5 Puertas de acceso

- Sin sesión, todo `/app` y `/albergue` redirige a `/ingresar`.
- Con sesión pero cuestionario incompleto, `/app` muestra A14 en lugar de las
  recomendaciones, con enlace directo al paso pendiente.
- El rol determina el árbol: un adoptante no ve `/albergue` y viceversa. Se puede
  cambiar de rol desde el perfil.
- El chat solo se habilita cuando existe una solicitud activa entre ambas partes.

---

## 7. Correspondencia entre encuesta y formularios

**Crítico para el modelo.** El cuestionario de compatibilidad de la app y la ficha de
mascota del rescatista deben pedir **exactamente las mismas variables, con las mismas
opciones y la misma codificación** que la encuesta de recolección. La encuesta es la
especificación de esos formularios. Si divergen, el modelo entrenado no sirve.

El formulario del rescatista debe incluir la opción «No lo sé» en energía,
sociabilidad y tolerancia a la soledad: un rescatista no siempre conoce esos datos, y
es preferible un valor faltante declarado a un dato inventado. Hay que decidir el
tratamiento de esos vacíos en el preprocesamiento.

El campo de descripción libre es el insumo del NLP que deduce rasgos implícitos que
el rescatista no marcó.

---

## 8. Estado del código local

Ya implementado en este repositorio:

- `assets/css/adoptanet.css` — todos los tokens y componentes de las secciones 1 y 2.
- `assets/js/sprite.js` — el set de iconos completo como SVG en línea.
- `app/para-ti.html` — A7 y D1 en una sola página responsive, con estado de carga.
- `design/globals.css` — los mismos tokens en formato de variables shadcn, listo para
  pegar en un proyecto Next.js con Tailwind.

Pendiente de portar: el resto del inventario de la sección 5. Todas las pantallas se
componen con las clases que ya están en `adoptanet.css`; no debería hacer falta CSS
nuevo salvo para la landing.
