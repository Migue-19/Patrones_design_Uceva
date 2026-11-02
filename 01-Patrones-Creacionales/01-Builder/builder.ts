/**
 * ! Patrón Builder (Creacional)
 *
 * ¿QUÉ HACE?
 * Construye un objeto complejo paso a paso. El mismo proceso de construcción
 * puede producir distintas representaciones del objeto final.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * En League Classic (la versión de la Season 3) cada jugador arma un "build"
 * antes de la partida: campeón, rol, nivel, ítems, runas, hechizos de
 * invocador y orden de habilidades. Muchos de esos datos son opcionales. Un constructor con 7 u 8
 * parámetros sería ilegible (new ChampionBuild('Ahri', 'Mid', 18, [...], ...)).
 *
 * ¿POR QUÉ BUILDER ES ADECUADO?
 * - Cada paso (setItems, setRunes...) tiene un nombre claro y se puede omitir.
 * - Se encadenan llamadas (fluent interface) y se lee casi como una frase.
 * - Con un "Director" podemos reutilizar recetas ya armadas (build AP, build ADC).
 *
 * VENTAJAS:
 * - Permite construir objetos complejos paso a paso; cada paso tiene nombre claro.
 * - El mismo Director puede reutilizar el builder para crear distintas variantes.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Si el objeto es simple (2-3 parámetros), un constructor directo es más sencillo.
 * - Requiere crear varias clases adicionales (Builder, Director, Producto).
 *
 * USO REAL: generadores de consultas SQL (query builders), constructores de
 * peticiones HTTP (RequestBuilder) y librerías como Lombok en Java.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Producto: el objeto complejo que queremos construir ----------
class ChampionBuild {
  public champion = 'Sin campeón';
  public role = 'Sin rol';
  public level = 1;
  public items: string[] = [];
  public runes: string[] = [];
  public summonerSpells: string[] = [];
  public skillOrder?: string; // Opcional: no todos los builds lo definen

  display() {
    console.log(`
    Campeón:  ${this.champion} (${this.role}) - Nivel ${this.level}
    Ítems:    ${this.items.join(', ') || 'Sin ítems'}
    Runas:    ${this.runes.join(', ') || 'Sin runas'}
    Hechizos: ${this.summonerSpells.join(', ') || 'Sin hechizos'}
    Orden de habilidades: ${this.skillOrder ?? 'No definido'}
    `);
  }
}

// ---------- Builder: expone los pasos de construcción ----------
class ChampionBuildBuilder {
  private build: ChampionBuild = new ChampionBuild();

  setChampion(champion: string, role: string): ChampionBuildBuilder {
    this.build.champion = champion;
    this.build.role = role;
    return this; // Retornar "this" permite encadenar los métodos
  }

  setLevel(level: number): ChampionBuildBuilder {
    this.build.level = level;
    return this;
  }

  setItems(...items: string[]): ChampionBuildBuilder {
    this.build.items = items;
    return this;
  }

  setRunes(...runes: string[]): ChampionBuildBuilder {
    this.build.runes = runes;
    return this;
  }

  setSummonerSpells(...spells: string[]): ChampionBuildBuilder {
    this.build.summonerSpells = spells;
    return this;
  }

  setSkillOrder(order: string): ChampionBuildBuilder {
    this.build.skillOrder = order;
    return this;
  }

  // Entrega el producto y deja listo el builder para construir otro build
  getResult(): ChampionBuild {
    const result = this.build;
    this.build = new ChampionBuild();
    return result;
  }
}

// ---------- Director: conoce "recetas" predefinidas ----------
class BuildDirector {
  constructor(private builder: ChampionBuildBuilder) {}

  buildMidMage(): ChampionBuild {
    return this.builder
      .setChampion('Ahri', 'Mid')
      .setLevel(18)
      .setItems('Ionian Boots of Lucidity', 'Lich Bane', "Rabadon's Deathcap")
      .setRunes('Greater Mark of Magic Penetration', 'Greater Seal of Armor', 'Greater Glyph of Ability Power')
      .setSummonerSpells('Flash', 'Ignite')
      .setSkillOrder('Q > W > E')
      .getResult();
  }

  buildAdc(): ChampionBuild {
    return this.builder
      .setChampion('Vayne', 'ADC')
      .setLevel(18)
      .setItems("Berserker's Greaves", 'Infinity Edge', 'The Bloodthirster')
      .setRunes('Greater Mark of Attack Damage', 'Greater Seal of Armor', 'Greater Glyph of Magic Resist')
      .setSummonerSpells('Flash', 'Heal')
      .getResult();
  }
}

function main() {
  const builder = new ChampionBuildBuilder();

  // 1) Uso manual: solo definimos lo que necesitamos (build mínimo)
  const newbieBuild = builder
    .setChampion('Garen', 'Top')
    .setItems('Heart of Gold')
    .getResult();

  console.log('%cBuild de un jugador nuevo:', COLORS.blue);
  newbieBuild.display();

  // 2) Uso con Director: recetas reutilizables
  const director = new BuildDirector(builder);

  console.log('%cBuild Mid (mago):', COLORS.purple);
  director.buildMidMage().display();

  console.log('%cBuild ADC:', COLORS.red);
  director.buildAdc().display();
}

main();
