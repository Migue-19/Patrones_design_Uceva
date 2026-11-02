/**
 * ! Patrón Strategy (Comportamiento)
 *
 * ¿QUÉ HACE?
 * Define una familia de algoritmos, encapsula cada uno en su propia clase y
 * los hace intercambiables en tiempo de ejecución.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * En LoL existen tres tipos de daño: físico (lo reduce la armadura), mágico
 * (lo reduce la resistencia mágica) y verdadero (nadie lo reduce). Calcular
 * el daño final con un gran "if/else" dentro de cada habilidad duplicaría
 * código y sería difícil de extender (¿y si aparece un nuevo tipo de daño?).
 *
 * ¿POR QUÉ STRATEGY ES ADECUADO?
 * - Cada fórmula de daño vive en su propia clase.
 * - La habilidad (contexto) no sabe cómo se calcula: solo delega.
 * - Se puede cambiar la estrategia en tiempo real, por ejemplo cuando el
 *   jugador cambia de daño físico a mágico al enfrentar a un tanque con
 *   mucha armadura.
 *
 * VENTAJAS:
 * - Elimina condicionales largos; agregar un nuevo tipo de daño es solo una clase nueva.
 * - El algoritmo puede sustituirse en tiempo de ejecución sin cambiar el contexto.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Si solo hay dos o tres variantes simples, lambdas o funciones son suficientes.
 * - El cliente debe conocer las estrategias disponibles para elegir la correcta.
 *
 * USO REAL: ordenación en colecciones (Comparator en Java), cálculo de rutas en
 * GPS (ruta más rápida / más corta / sin peajes) y validadores de formularios.
 *
 * https://refactoring.guru/es/design-patterns/strategy
 */

import { COLORS } from '../../helpers/colors.ts';

interface Target {
  name: string;
  armor: number;
  magicResist: number;
}

// ---------- Estrategia: interfaz común ----------
interface DamageStrategy {
  readonly type: string;
  calculate(baseDamage: number, target: Target): number;
}

// ---------- Estrategias concretas ----------
class PhysicalDamage implements DamageStrategy {
  readonly type = 'Físico';
  calculate(baseDamage: number, target: Target): number {
    // Fórmula de LoL: el daño se reduce según 100 / (100 + armadura)
    return Math.round(baseDamage * (100 / (100 + target.armor)));
  }
}

class MagicDamage implements DamageStrategy {
  readonly type = 'Mágico';
  calculate(baseDamage: number, target: Target): number {
    return Math.round(baseDamage * (100 / (100 + target.magicResist)));
  }
}

class TrueDamage implements DamageStrategy {
  readonly type = 'Verdadero';
  calculate(baseDamage: number, _target: Target): number {
    return baseDamage; // Ignora armadura y resistencia mágica
  }
}

// ---------- Contexto: la habilidad usa una estrategia ----------
class Ability {
  constructor(
    private name: string,
    private baseDamage: number,
    private strategy: DamageStrategy,
  ) {}

  // Permite cambiar el algoritmo en tiempo de ejecución
  setStrategy(strategy: DamageStrategy) {
    this.strategy = strategy;
  }

  cast(target: Target) {
    const damage = this.strategy.calculate(this.baseDamage, target);
    console.log(
      `  ${this.name} (${this.strategy.type}) a ${target.name}: ${this.baseDamage} base -> %c${damage} de daño`,
      COLORS.red,
    );
  }
}

function main() {
  const tank: Target = { name: 'Malphite', armor: 120, magicResist: 40 };

  console.log('%cMisma habilidad, distinto tipo de daño:', COLORS.blue);
  new Ability('Disparo en Ráfaga (Ashe)', 200, new PhysicalDamage()).cast(tank);
  new Ability('Q de Annie', 200, new MagicDamage()).cast(tank);
  new Ability('W de Vayne', 200, new TrueDamage()).cast(tank);

  // Cambio de estrategia en tiempo de ejecución
  console.log('\n%cEl jugador se adapta al enemigo (cambia la estrategia):', COLORS.purple);
  const ability = new Ability('Habilidad de Kayle', 200, new PhysicalDamage());
  ability.cast(tank); // El tanque tiene mucha armadura: poco daño

  console.log('  ...compra ítems de poder de habilidad y cambia a daño mágico...');
  ability.setStrategy(new MagicDamage());
  ability.cast(tank);
}

main();
