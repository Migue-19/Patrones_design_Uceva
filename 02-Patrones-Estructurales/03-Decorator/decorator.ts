/**
 * ! Patrón Decorator (Estructural)
 *
 * ¿QUÉ HACE?
 * Añade responsabilidades nuevas a un objeto de forma dinámica, envolviéndolo
 * en "capas" (decoradores) que implementan la misma interfaz.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * Un campeón puede comprar cualquier combinación de ítems y recibir buffs
 * temporales (como el Barón). Si creáramos una subclase por cada combinación
 * (VayneConInfinityEdge, VayneConInfinityEdgeYBaron...) tendríamos una
 * explosión de clases imposible de mantener.
 *
 * ¿POR QUÉ DECORATOR ES ADECUADO?
 * - Cada ítem es un decorador que modifica las estadísticas del campeón.
 * - Se pueden apilar en cualquier orden y cantidad, en tiempo de ejecución.
 * - El campeón base no cambia (principio Abierto/Cerrado).
 *
 * VENTAJAS:
 * - Las responsabilidades se añaden y quitan en tiempo de ejecución sin subclases.
 * - Se pueden combinar decoradores en cualquier orden.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Muchos decoradores apilados dificultan la depuración (el stack de llamadas crece).
 * - El orden de los decoradores puede importar y generar comportamientos inesperados.
 *
 * USO REAL: streams de Java/Node (GZipStream, BufferedStream), middlewares en
 * Express/Koa y los decoradores de TypeScript/Python en frameworks como NestJS.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Componente: interfaz común ----------
interface Champion {
  getName(): string;
  getAttack(): number;
  getHealth(): number;
}

// ---------- Componente concreto: el campeón sin ítems ----------
class BaseChampion implements Champion {
  constructor(private name: string, private attack: number, private health: number) {}

  getName() {
    return this.name;
  }
  getAttack() {
    return this.attack;
  }
  getHealth() {
    return this.health;
  }
}

// ---------- Decorador base: envuelve a otro Champion ----------
abstract class ChampionDecorator implements Champion {
  constructor(protected champion: Champion) {}

  // Por defecto delega todo en el campeón envuelto
  getName() {
    return this.champion.getName();
  }
  getAttack() {
    return this.champion.getAttack();
  }
  getHealth() {
    return this.champion.getHealth();
  }
}

// ---------- Decoradores concretos (ítems y buffs) ----------
class InfinityEdge extends ChampionDecorator {
  override getName() {
    return `${this.champion.getName()} + Infinity Edge`;
  }
  override getAttack() {
    return this.champion.getAttack() + 70;
  }
}

class WarmogsArmor extends ChampionDecorator {
  override getName() {
    return `${this.champion.getName()} + Warmog's Armor`;
  }
  override getHealth() {
    return this.champion.getHealth() + 1000;
  }
}

class BaronBuff extends ChampionDecorator {
  override getName() {
    return `${this.champion.getName()} + Buff de Barón`;
  }
  override getAttack() {
    return this.champion.getAttack() + 40;
  }
  override getHealth() {
    return this.champion.getHealth() + 150;
  }
}

function showChampion(champion: Champion) {
  console.log(`  ${champion.getName()}`);
  console.log(`  -> Ataque: ${champion.getAttack()} | Vida: ${champion.getHealth()}\n`);
}

function main() {
  let vayne: Champion = new BaseChampion('Vayne', 60, 1200);
  console.log('%cVayne sin ítems:', COLORS.blue);
  showChampion(vayne);

  // Cada compra "envuelve" al campeón con una capa nueva
  vayne = new InfinityEdge(vayne);
  console.log('%cVayne compra Infinity Edge:', COLORS.green);
  showChampion(vayne);

  vayne = new WarmogsArmor(vayne);
  console.log("%cVayne compra Warmog's Armor:", COLORS.green);
  showChampion(vayne);

  vayne = new BaronBuff(vayne);
  console.log('%cEl equipo mata al Barón:', COLORS.purple);
  showChampion(vayne);
}

main();
