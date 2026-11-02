# Taller de Patrones de Diseño — League of Legends (League Classic)

**Universidad:** Unidad Central del Valle del Cauca (UCEVA) — Facultad de Ingeniería **Asignatura:** Arquitectura de
Software **Docente:** Jesus David Mejia Vergara **Temática:** todos los ejercicios están ambientados en _League Classic_
(la versión de la Season 3 de League of Legends): solo se usan campeones, ítems, runas, hechizos y monstruos de ese
modo.

---

## Integrantes

- Miguel Angel Ruiz Urmendis
- Jolmer Alexander Viedma Agudelo

---

## Patrones utilizados

Cada archivo incluye comentarios que explican **qué hace el patrón**, **qué problema se resuelve** y **por qué ese
patrón es adecuado**, junto con ventajas, desventajas y un caso de uso real en la industria.

| #  | Patrón         | Categoría                    | Archivo                                                        | Descripción del ejercicio                                                                                                                     |
| -- | -------------- | ---------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | Builder        | Creacional (obligatorio)     | `01-Patrones-Creacionales/01-Builder/builder.ts`               | Construcción paso a paso del "build" de un campeón (ítems, runas, hechizos) con un Director que ofrece recetas predefinidas.                  |
| 2  | Factory Method | Creacional (adicional)       | `01-Patrones-Creacionales/02-Factory-Method/factory-method.ts` | Spawners de monstruos de Summoner's Rift (Dragón, Barón, Gólem Ancestral) que comparten el flujo de aparición pero crean monstruos distintos. |
| 3  | Prototype      | Creacional (adicional)       | `01-Patrones-Creacionales/03-Prototype/prototype.ts`           | Clonación profunda de un campeón (clon de Shaco y partida espejo) sin reconstruirlo desde cero.                                               |
| 4  | Adapter        | Estructural (obligatorio)    | `02-Patrones-Estructurales/01-Adapter/adapter.ts`              | Adapta las estadísticas de partida de un servicio viejo (texto `"Faker;12;3;8"`) a la interfaz que espera el marcador nuevo.                  |
| 5  | Flyweight      | Estructural (obligatorio)    | `02-Patrones-Estructurales/02-Flyweight/flyweight.ts`          | Comparte modelos y datos de 3 tipos de minion entre 3000 minions para ahorrar memoria.                                                        |
| 6  | Decorator      | Estructural (adicional)      | `02-Patrones-Estructurales/03-Decorator/decorator.ts`          | Ítems y buffs (Infinity Edge, Warmog's, Barón) que se apilan sobre un campeón modificando sus estadísticas.                                   |
| 7  | Observer       | Comportamiento (obligatorio) | `03-Patrones-Comportamiento/01-Observer/observer.ts`           | La partida notifica eventos (Barón, Dragón, Torre, Nexo) a jugadores, narrador y marcador suscritos.                                          |
| 8  | Strategy       | Comportamiento (adicional)   | `03-Patrones-Comportamiento/02-Strategy/strategy.ts`           | Cálculo de daño físico, mágico o verdadero intercambiable en tiempo de ejecución.                                                             |
| 9  | State          | Comportamiento (adicional)   | `03-Patrones-Comportamiento/03-State/state.ts`                 | Estados del campeón (Activo, Aturdido, Recalleando, Muerto) que cambian cómo responde a cada acción.                                          |
| 10 | Command        | Comportamiento (adicional)   | `03-Patrones-Comportamiento/04-Command/command.ts`             | Tienda con compras y ventas como comandos y botón "Deshacer" mediante historial.                                                              |

---

## Requisitos

Instala [Deno 2.x](https://deno.com) (no requiere Node.js ni configuración adicional):

```bash
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex
```

---

## Cómo ejecutar

```bash
# Ejecutar un ejercicio individual (desde la raíz del repositorio)
deno run 01-Patrones-Creacionales/01-Builder/builder.ts
deno run 02-Patrones-Estructurales/01-Adapter/adapter.ts
# ... etc.

# Ejecutar todos los ejercicios en secuencia
deno task all
```

---

## Estructura del repositorio

```
01-Patrones-Creacionales/
    01-Builder/
        builder.ts
    02-Factory-Method/
        factory-method.ts
    03-Prototype/
        prototype.ts
02-Patrones-Estructurales/
    01-Adapter/
        adapter.ts
    02-Flyweight/
        flyweight.ts
    03-Decorator/
        decorator.ts
03-Patrones-Comportamiento/
    01-Observer/
        observer.ts
    02-Strategy/
        strategy.ts
    03-State/
        state.ts
    04-Command/
        command.ts
helpers/
    colors.ts       # utilidades compartidas (estilos de consola)
    sleep.ts        # utilidad para pausas asíncronas
deno.json           # configuración de tareas y formato
README.md
```

---

## Recursos adicionales

- [Refactoring Guru — Catálogo de Patrones](https://refactoring.guru/es/design-patterns/catalog)
- [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans)
- [Patterns.dev](https://www.patterns.dev/)
- [Design Patterns in TypeScript](https://github.com/torokmark/design_patterns_in_typescript)
