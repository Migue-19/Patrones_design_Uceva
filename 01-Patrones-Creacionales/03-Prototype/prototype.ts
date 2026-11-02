/**
 * ! Patrón Prototype (Creacional)
 *
 * ¿QUÉ HACE?
 * Crea nuevos objetos copiando (clonando) uno ya existente, sin depender de
 * su clase concreta ni repetir el proceso de construcción.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * Shaco puede crear un clon de sí mismo (su habilidad "Alucinación"). Ese clon
 * debe nacer con las mismas estadísticas e ítems que el Shaco original. Volver
 * a construir al campeón desde cero (calcular stats, equipar ítems...) es
 * costoso y repetitivo, y además no queremos que el clon comparta el mismo
 * arreglo de ítems que el original (si no, modificar uno afectaría al otro).
 *
 * ¿POR QUÉ PROTOTYPE ES ADECUADO?
 * - El propio objeto sabe cómo copiarse: champion.clone().
 * - Hacemos una copia PROFUNDA (stats e ítems propios) para evitar efectos
 *   secundarios entre el original y su clon.
 * - El código cliente no necesita conocer los detalles internos del campeón.
 *
 * VENTAJAS:
 * - Clonar es más rápido que reconstruir un objeto complejo desde cero.
 * - Permite crear variantes sin acoplar el cliente a clases concretas.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Clonar objetos con referencias circulares puede ser complicado.
 * - Si el objeto es sencillo, un constructor normal es más claro.
 *
 * USO REAL: los prototipos de JavaScript/TypeScript (Object.create) y la
 * clonación de documentos en editores como Figma o Google Docs.
 *
 * https://refactoring.guru/es/design-patterns/prototype
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Interfaz Prototype ----------
interface Prototype<T> {
  clone(): T;
}

interface Stats {
  hp: number;
  attack: number;
  armor: number;
}

// ---------- Prototipo concreto ----------
class Champion implements Prototype<Champion> {
  constructor(
    public name: string,
    public stats: Stats,
    public items: string[],
  ) {}

  // Copia profunda: nuevos objetos para stats e items
  clone(): Champion {
    return new Champion(this.name, { ...this.stats }, [...this.items]);
  }

  display(label: string) {
    console.log(
      `  ${label}: ${this.name} | HP ${this.stats.hp} | AD ${this.stats.attack}` +
        ` | Armadura ${this.stats.armor} | Ítems: ${this.items.join(', ')}`,
    );
  }
}

function main() {
  // Shaco original, ya "construido" con sus stats e ítems de League Classic
  const shaco = new Champion('Shaco', { hp: 2200, attack: 140, armor: 60 }, ["Youmuu's Ghostblade", 'Trinity Force']);

  console.log('%cShaco usa Alucinación y crea un clon:', COLORS.purple);
  const shacoClone = shaco.clone();
  shacoClone.name = 'Shaco (Clon)';

  // El clon es más débil: modificamos SOLO su copia
  shacoClone.stats.attack = Math.round(shaco.stats.attack * 0.75);
  shacoClone.items.push('Ilusión temporal');

  shaco.display('Original');
  shacoClone.display('Clon    ');

  // Verificamos que son objetos independientes
  console.log(`\n%c¿Comparten el mismo arreglo de ítems? ${shaco.items === shacoClone.items}`, COLORS.green);
  console.log(`%c¿Son el mismo objeto? ${shaco === shacoClone}`, COLORS.green);

  // Partida espejo: clonamos para crear un campeón idéntico del equipo rival
  console.log('\n%cPartida espejo (mirror match):', COLORS.blue);
  const enemyShaco = shaco.clone();
  enemyShaco.display('Rival   ');
}

main();
