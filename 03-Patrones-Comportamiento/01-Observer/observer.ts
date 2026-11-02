/**
 * ! Patrón Observer (Comportamiento)
 *
 * ¿QUÉ HACE?
 * Define una relación de uno a muchos: cuando un objeto (sujeto) cambia su
 * estado, todos sus observadores se enteran automáticamente.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * Cuando alguien mata al Barón o cae una torre, el juego debe avisar a los
 * jugadores, al narrador y al marcador de la partida. El servidor no debería
 * tener que conocer a cada uno de ellos ni preguntar constantemente
 * "¿pasó algo?".
 *
 * ¿POR QUÉ OBSERVER ES ADECUADO?
 * - La partida (sujeto) solo conoce la interfaz Observer, no clases concretas.
 * - Se pueden suscribir o desuscribir observadores en cualquier momento.
 * - Agregar un nuevo observador (ej. un bot de Discord) no cambia el sujeto.
 *
 * VENTAJAS:
 * - Desacopla al sujeto de sus observadores (bajo acoplamiento).
 * - Se pueden añadir o quitar observadores en tiempo de ejecución.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Si hay muchos observadores, las notificaciones pueden volverse lentas.
 * - El orden de notificación no siempre es predecible.
 *
 * USO REAL: sistemas de eventos en frameworks UI (React, Angular), buses de
 * mensajes (RabbitMQ, Kafka) y notificaciones push en apps móviles.
 *
 * https://refactoring.guru/es/design-patterns/observer
 */

import { COLORS } from '../../helpers/colors.ts';

type GameEvent = 'BARON_SLAIN' | 'DRAGON_SLAIN' | 'TURRET_DESTROYED' | 'NEXUS_DESTROYED';

interface Observer {
  update(event: GameEvent, team: string): void;
}

// ---------- Sujeto: la partida emite los eventos ----------
class Match {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
    console.log(`  %c[Match] Observador suscrito (total: ${this.observers.length})`, COLORS.gray);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
    console.log(`  %c[Match] Observador desuscrito (total: ${this.observers.length})`, COLORS.gray);
  }

  // Notifica a todos los observadores suscritos
  triggerEvent(event: GameEvent, team: string) {
    console.log(`%c>>> Evento: ${event} por el equipo ${team}`, COLORS.yellow);
    this.observers.forEach((observer) => observer.update(event, team));
  }
}

// ---------- Observadores concretos ----------
class Player implements Observer {
  constructor(private name: string) {}

  update(event: GameEvent, team: string) {
    console.log(`  [Jugador ${this.name}] vio en pantalla: ${event} (${team})`);
  }
}

class Caster implements Observer {
  update(event: GameEvent, team: string) {
    if (event === 'NEXUS_DESTROYED') {
      console.log(`  [Narrador] ¡¡SE ACABÓ!! El equipo ${team} gana la partida.`);
    } else {
      console.log(`  [Narrador] Atención, ${event} para el equipo ${team}.`);
    }
  }
}

class Scoreboard implements Observer {
  private objectives: Record<string, number> = {};

  update(event: GameEvent, team: string) {
    const key = `${team}:${event}`;
    this.objectives[key] = (this.objectives[key] ?? 0) + 1;
    console.log(`  [Marcador] ${key} = ${this.objectives[key]}`);
  }
}

function main() {
  const match = new Match();

  const faker = new Player('Faker');
  const caster = new Caster();
  const scoreboard = new Scoreboard();

  console.log('%cSuscribiendo observadores:', COLORS.blue);
  match.subscribe(faker);
  match.subscribe(caster);
  match.subscribe(scoreboard);

  console.log('');
  match.triggerEvent('DRAGON_SLAIN', 'Azul');
  match.triggerEvent('BARON_SLAIN', 'Rojo');

  // Faker derriba una torre y se dispara el evento TURRET_DESTROYED
  match.triggerEvent('TURRET_DESTROYED', 'Azul');

  // Faker se desconecta: ya no recibirá más notificaciones
  console.log('\n%cFaker se desconecta de la partida...', COLORS.red);
  match.unsubscribe(faker);

  match.triggerEvent('NEXUS_DESTROYED', 'Azul');
}

main();
