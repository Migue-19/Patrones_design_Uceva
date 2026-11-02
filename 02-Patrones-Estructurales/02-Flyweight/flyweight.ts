/**
 * ! Patrón Flyweight (Estructural)
 *
 * ¿QUÉ HACE?
 * Comparte entre muchos objetos la parte de su estado que se repite
 * (estado intrínseco) para ahorrar memoria. Lo que es único de cada objeto
 * (estado extrínseco) se guarda aparte.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * En Summoner's Rift aparecen cientos de minions en una partida. Todos los
 * minions melee comparten el mismo modelo 3D, la misma textura y el mismo daño
 * base. Si cada minion guardara su propia copia, gastaríamos memoria
 * innecesariamente. Lo único distinto es su posición, vida y equipo.
 *
 * ¿POR QUÉ FLYWEIGHT ES ADECUADO?
 * - Solo existe UNA instancia por tipo de minion (melee, caster, cañón).
 * - Una fábrica (cache) entrega siempre la misma instancia compartida.
 * - Con miles de minions, pasamos de miles de objetos pesados a solo 3.
 *
 * VENTAJAS:
 * - Reduce drásticamente el uso de memoria cuando hay muchos objetos similares.
 * - El estado intrínseco es inmutable y seguro para compartir.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Añade complejidad; no vale la pena si el número de objetos es pequeño.
 * - El estado extrínseco debe gestionarse en el código cliente.
 *
 * USO REAL: motores de videojuegos (Unity, Unreal) para renderizar partículas
 * o vegetación repetida (miles de árboles idénticos en escena).
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Función auxiliar: genera el nombre del modelo 3D ----------
function buildModelName(name: string): string {
  // Elimina tildes y convierte a minúsculas para obtener el nombre del archivo
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '_model.glb';
}

// Daño base según el tipo de minion (valores de ejemplo para la demostración)
const BASE_DAMAGE: Record<string, number> = {
  Melee: 22,
  Caster: 14,
  'Cañón': 40,
};

// ---------- Flyweight: estado INTRÍNSECO (compartido e inmutable) ----------
class MinionType {
  constructor(
    public readonly name: string,
    public readonly model3D: string, // En la vida real serían MBs de datos
    public readonly baseDamage: number,
  ) {}

  // El estado extrínseco (posición, vida, equipo) llega como parámetro
  draw(x: number, y: number, team: string, hp: number) {
    console.log(`  ${this.name} [${this.model3D}] equipo ${team} en (${x}, ${y}) HP:${hp} Daño:${this.baseDamage}`);
  }
}

// ---------- Fábrica: garantiza que los flyweights se reutilicen ----------
class MinionTypeFactory {
  private static types: Record<string, MinionType> = {};

  static getType(name: string): MinionType {
    if (!this.types[name]) {
      console.log(`%cCreando modelo compartido para: ${name}`, COLORS.red);
      this.types[name] = new MinionType(name, buildModelName(name), BASE_DAMAGE[name] ?? 12);
    }
    return this.types[name];
  }

  static countTypes(): number {
    return Object.keys(this.types).length;
  }
}

// ---------- Contexto: guarda el estado EXTRÍNSECO de cada minion ----------
class Minion {
  constructor(
    private x: number,
    private y: number,
    private team: 'Azul' | 'Rojo',
    private hp: number,
    private type: MinionType, // Referencia al flyweight compartido
  ) {}

  draw() {
    this.type.draw(this.x, this.y, this.team, this.hp);
  }

  // Expone el flyweight para comparaciones
  getType(): MinionType {
    return this.type;
  }
}

function main() {
  const wave: Minion[] = [];
  const kinds = ['Melee', 'Caster', 'Cañón'];

  // Generamos 3000 minions (1000 por tipo)
  for (let i = 0; i < 3000; i++) {
    const kind = kinds[i % 3];
    const type = MinionTypeFactory.getType(kind); // Reutiliza o crea
    wave.push(new Minion(i, i * 2, i % 2 === 0 ? 'Azul' : 'Rojo', 450, type));
  }

  console.log('\n%cMostrando los primeros 3 minions de la oleada:', COLORS.blue);
  wave.slice(0, 3).forEach((minion) => minion.draw());

  // Demostración clave: dos minions Melee comparten EXACTAMENTE la misma instancia
  const minionA = wave[0]; // Melee (índice 0)
  const minionB = wave[3]; // Melee (índice 3)
  console.log('\n%cComparación de instancias compartidas:', COLORS.purple);
  console.log(`  ¿minionA y minionB comparten el mismo flyweight? ${minionA.getType() === minionB.getType()}`);
  console.log(`  Sin Flyweight: se habrían creado ${wave.length} objetos MinionType`);
  console.log(`  Con Flyweight: solo se crearon ${MinionTypeFactory.countTypes()} objetos MinionType`);

  console.log(`\n%cMinions en juego: ${wave.length}`, COLORS.green);
  console.log(`%cModelos compartidos creados (flyweights): ${MinionTypeFactory.countTypes()}`, COLORS.green);
}

main();
