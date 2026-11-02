/**
 * ! Patrón State (Comportamiento)
 *
 * ¿QUÉ HACE?
 * Permite que un objeto cambie su comportamiento cuando cambia su estado
 * interno. Parece que el objeto cambiara de clase.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * Un campeón puede estar Activo, Aturdido, Recalleando (volviendo a la base)
 * o Muerto. En cada estado las mismas acciones (moverse, atacar, recall)
 * responden distinto: un campeón aturdido NO puede moverse, uno muerto NO
 * puede hacer nada y un recall se cancela si recibes daño. Con "if/else"
 * por estado en cada método, el código se llenaría de condiciones anidadas.
 *
 * ¿POR QUÉ STATE ES ADECUADO?
 * - Cada estado es una clase con su propio comportamiento.
 * - Las transiciones (aturdido -> activo, muerto -> activo) quedan en un solo
 *   lugar: dentro de cada estado.
 * - Agregar un estado nuevo (ej. "Congelado") no modifica los demás.
 *
 * VENTAJAS:
 * - Elimina grandes bloques if/else anidados relacionados con el estado.
 * - Las transiciones entre estados son explícitas y fáciles de localizar.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Si hay pocos estados con lógica trivial, añade complejidad innecesaria.
 * - El número de clases crece con cada estado nuevo.
 *
 * USO REAL: máquinas de estado en motores de videojuegos (animaciones de
 * personajes), parsers de texto y flujos de pago en e-commerce.
 *
 * https://refactoring.guru/es/design-patterns/state
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Interfaz de estado ----------
interface ChampionState {
  readonly name: string;
  move(champion: ChampionUnit): void;
  attack(champion: ChampionUnit): void;
  recall(champion: ChampionUnit): void;
  takeDamage(champion: ChampionUnit, damage: number): void;
  stun(champion: ChampionUnit): void;
  tick(champion: ChampionUnit): void; // Representa el paso del tiempo
}

// ---------- Contexto: el campeón ----------
class ChampionUnit {
  public hp: number;
  private state: ChampionState;

  constructor(public name: string, public maxHp: number) {
    this.hp = maxHp;
    this.state = new ActiveState();
  }

  setState(state: ChampionState) {
    console.log(`  %c[${this.name}] ${this.state.name} -> ${state.name}`, COLORS.yellow);
    this.state = state;
  }

  // Todas las acciones se delegan al estado actual
  move() {
    this.state.move(this);
  }

  attack() {
    this.state.attack(this);
  }

  recall() {
    this.state.recall(this);
  }

  takeDamage(damage: number) {
    this.state.takeDamage(this, damage);
  }

  stun() {
    this.state.stun(this);
  }

  tick() {
    this.state.tick(this);
  }
}

// ---------- Función auxiliar compartida: aplica daño y transiciona a Muerto si HP llega a 0 ----------
function applyDamage(c: ChampionUnit, damage: number, msg: string) {
  c.hp = Math.max(c.hp - damage, 0);
  console.log(`  ${c.name} ${msg} ${damage} de daño (HP: ${c.hp}).`);
  if (c.hp === 0) {
    c.setState(new DeadState());
  }
}

// ---------- Estados concretos ----------
class ActiveState implements ChampionState {
  readonly name = 'Activo';

  move(c: ChampionUnit) {
    console.log(`  ${c.name} se mueve.`);
  }

  attack(c: ChampionUnit) {
    console.log(`  ${c.name} ataca.`);
  }

  recall(c: ChampionUnit) {
    c.setState(new RecallingState());
  }

  stun(c: ChampionUnit) {
    c.setState(new StunnedState());
  }

  tick(_c: ChampionUnit) {
    /* No pasa nada especial */
  }

  takeDamage(c: ChampionUnit, damage: number) {
    applyDamage(c, damage, 'recibe');
  }
}

class StunnedState implements ChampionState {
  readonly name = 'Aturdido';

  move(c: ChampionUnit) {
    console.log(`  ${c.name} sufre aturdimiento y NO puede moverse.`);
  }

  attack(c: ChampionUnit) {
    console.log(`  ${c.name} sufre aturdimiento y NO puede atacar.`);
  }

  recall(c: ChampionUnit) {
    console.log(`  ${c.name} no puede hacer recall durante el aturdimiento.`);
  }

  stun(_c: ChampionUnit) {
    /* Ya está aturdido */
  }

  tick(c: ChampionUnit) {
    c.setState(new ActiveState()); // El aturdimiento termina
  }

  takeDamage(c: ChampionUnit, damage: number) {
    applyDamage(c, damage, 'recibe');
  }
}

class RecallingState implements ChampionState {
  readonly name = 'Recalleando';

  move(c: ChampionUnit) {
    console.log(`  ${c.name} se mueve y cancela el recall.`);
    c.setState(new ActiveState());
  }

  attack(c: ChampionUnit) {
    console.log(`  ${c.name} ataca y cancela el recall.`);
    c.setState(new ActiveState());
  }

  recall(_c: ChampionUnit) {
    /* Ya está haciendo recall */
  }

  stun(c: ChampionUnit) {
    c.setState(new StunnedState());
  }

  tick(c: ChampionUnit) {
    c.hp = c.maxHp; // Llegó a la base y se cura por completo
    console.log(`  ${c.name} llegó a la base y recuperó toda su vida (HP: ${c.hp}).`);
    c.setState(new ActiveState());
  }

  takeDamage(c: ChampionUnit, damage: number) {
    c.hp = Math.max(c.hp - damage, 0);
    console.log(`  ${c.name} recibe ${damage} de daño: el recall se interrumpe.`);
    c.setState(c.hp === 0 ? new DeadState() : new ActiveState());
  }
}

class DeadState implements ChampionState {
  readonly name = 'Muerto';

  move(c: ChampionUnit) {
    console.log(`  ${c.name} ha caído y no puede moverse.`);
  }

  attack(c: ChampionUnit) {
    console.log(`  ${c.name} ha caído y no puede atacar.`);
  }

  recall(c: ChampionUnit) {
    console.log(`  ${c.name} ha caído: no hay recall.`);
  }

  stun(_c: ChampionUnit) {
    /* Un muerto no puede ser aturdido */
  }

  takeDamage(_c: ChampionUnit, _damage: number) {
    /* Ya está muerto */
  }

  tick(c: ChampionUnit) {
    c.hp = c.maxHp;
    console.log(`  ${c.name} reaparece en la fuente con toda su vida.`);
    c.setState(new ActiveState());
  }
}

function main() {
  const ahri = new ChampionUnit('Ahri', 1000);

  console.log('%cEstado Activo:', COLORS.green);
  ahri.move();
  ahri.attack();

  console.log('\n%cMalphite la aturde:', COLORS.purple);
  ahri.stun();
  ahri.move(); // No puede
  ahri.tick(); // Termina el aturdimiento

  console.log('\n%cIntenta hacer recall:', COLORS.blue);
  ahri.recall();
  ahri.takeDamage(200); // Se interrumpe el recall

  console.log('\n%cUn enemigo la mata:', COLORS.red);
  ahri.takeDamage(900);
  ahri.attack(); // Está muerta
  ahri.tick(); // Reaparece
}

main();
