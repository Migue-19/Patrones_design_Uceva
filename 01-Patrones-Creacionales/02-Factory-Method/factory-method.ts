/**
 * ! Patrón Factory Method (Creacional)
 *
 * ¿QUÉ HACE?
 * Define un método para crear objetos en una clase base (creador) y deja que
 * las subclases decidan qué clase concreta se instancia.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * En Summoner's Rift de League Classic aparecen monstruos importantes: el
 * Dragón, el Barón Nashor y el Gólem Ancestral. Cada uno tiene vida y
 * recompensa distintas, pero el proceso
 * de aparición es el mismo (crear -> anunciar -> ponerlo en el mapa).
 * Si usamos "if/else" con el nombre del monstruo en toda la partida, agregar
 * un monstruo nuevo obliga a modificar código que ya funciona.
 *
 * ¿POR QUÉ FACTORY METHOD ES ADECUADO?
 * - El flujo común vive en la clase base (spawn).
 * - Cada subclase solo implementa createMonster() con su monstruo.
 * - Agregar un nuevo monstruo es crear una clase nueva, sin tocar las demás.
 *
 * VENTAJAS:
 * - Cumple el principio Abierto/Cerrado: agregar monstruos no modifica código existente.
 * - El flujo común de creación vive en un solo lugar (clase base).
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Requiere crear una subclase por cada tipo de producto; puede resultar excesivo.
 * - Si el flujo de creación es trivial, un simple constructor o función basta.
 *
 * USO REAL: frameworks de UI (botones, ventanas según el sistema operativo),
 * loggers y drivers de base de datos que crean conexiones según la configuración.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Producto (interfaz) ----------
interface Monster {
  name: string;
  hp: number;
  reward: string;
}

// ---------- Productos concretos ----------
class Dragon implements Monster {
  name = 'Dragón';
  hp = 3500;
  reward = 'Oro para todo el equipo';
}

class BaronNashor implements Monster {
  name = 'Barón Nashor';
  hp = 9000;
  reward = 'Buff de Barón (refuerza súbditos)';
}

class AncientGolem implements Monster {
  name = 'Gólem Ancestral';
  hp = 1800;
  reward = 'Buff Azul (maná y reducción de enfriamiento)';
}

// ---------- Creador: tiene el flujo común y el factory method ----------
abstract class MonsterSpawner {
  // Factory Method: las subclases deciden qué monstruo se crea
  protected abstract createMonster(): Monster;

  // Lógica común que NO depende del tipo de monstruo
  spawn(): Monster {
    const monster = this.createMonster();
    console.log(`%c¡Apareció ${monster.name}!`, COLORS.red, `HP: ${monster.hp} | Recompensa: ${monster.reward}`);
    return monster;
  }
}

// ---------- Creadores concretos ----------
class DragonSpawner extends MonsterSpawner {
  protected override createMonster(): Monster {
    return new Dragon();
  }
}

class BaronSpawner extends MonsterSpawner {
  protected override createMonster(): Monster {
    return new BaronNashor();
  }
}

class AncientGolemSpawner extends MonsterSpawner {
  protected override createMonster(): Monster {
    return new AncientGolem();
  }
}

function main() {
  // El código cliente solo conoce a MonsterSpawner, no a los monstruos concretos
  const spawners: MonsterSpawner[] = [
    new AncientGolemSpawner(), // Minuto 1:55
    new DragonSpawner(), // Minuto 5
    new BaronSpawner(), // Minuto 20
  ];

  spawners.forEach((spawner) => spawner.spawn());
}

main();
