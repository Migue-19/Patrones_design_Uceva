/**
 * ! Patrón Adapter (Estructural)
 *
 * ¿QUÉ HACE?
 * Permite que dos clases con interfaces incompatibles trabajen juntas.
 * Envuelve a la clase "vieja" y la traduce a la interfaz que el cliente espera.
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * Nuestra app de estadísticas de partida espera objetos con la forma
 * { summoner, kills, deaths, assists }. Pero el servicio heredado (legacy) del
 * servidor viejo entrega los datos como un texto plano: "Faker;12;3;8".
 * No podemos (ni queremos) modificar el servicio viejo, porque otras partes
 * del sistema todavía dependen de él.
 *
 * ¿POR QUÉ ADAPTER ES ADECUADO?
 * - El cliente sigue usando una sola interfaz (MatchStatsProvider).
 * - No tocamos el código legado (principio Abierto/Cerrado).
 * - Si mañana cambia la fuente de datos, solo se escribe otro adaptador.
 *
 * VENTAJAS:
 * - Reutiliza código legado sin modificarlo (principio Abierto/Cerrado).
 * - Desacopla al cliente de la implementación concreta del proveedor.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Si la interfaz incompatible es muy compleja, el adaptador puede volverse grande.
 * - A veces es preferible refactorizar directamente si se controla ambos lados.
 *
 * USO REAL: SDKs de pago (Stripe, PayPal) que adaptan distintas APIs bancarias
 * a una interfaz uniforme, y conectores JDBC/ODBC en bases de datos.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Interfaz que espera nuestra aplicación (Target) ----------
interface PlayerStats {
  summoner: string;
  kills: number;
  deaths: number;
  assists: number;
}

interface MatchStatsProvider {
  getPlayerStats(): PlayerStats;
}

// ---------- Servicio viejo, incompatible (Adaptee) ----------
class LegacyStatsService {
  // Devuelve un texto con formato "nombre;kills;deaths;assists"
  fetchRawStats(): string {
    return 'Faker;12;3;8';
  }
}

// ---------- Adaptador: traduce el texto a la interfaz nueva ----------
class LegacyStatsAdapter implements MatchStatsProvider {
  constructor(private legacyService: LegacyStatsService) {}

  getPlayerStats(): PlayerStats {
    const raw = this.legacyService.fetchRawStats();
    const parts = raw.split(';');

    // Validación: el texto debe tener exactamente 4 campos con números válidos
    if (parts.length !== 4) {
      throw new Error(`Formato inválido: se esperaban 4 campos separados por ";", se recibió: "${raw}"`);
    }

    const [summoner, killsRaw, deathsRaw, assistsRaw] = parts;
    const kills = Number(killsRaw);
    const deaths = Number(deathsRaw);
    const assists = Number(assistsRaw);

    if (!summoner || isNaN(kills) || isNaN(deaths) || isNaN(assists)) {
      throw new Error(`Datos inválidos en el texto: "${raw}". kills/deaths/assists deben ser números.`);
    }

    return { summoner, kills, deaths, assists };
  }
}

// ---------- Cliente: solo conoce MatchStatsProvider ----------
function showScoreboard(provider: MatchStatsProvider) {
  const { summoner, kills, deaths, assists } = provider.getPlayerStats();
  // El KDA es (kills + assists) / deaths; evitamos dividir por cero
  const kda = ((kills + assists) / Math.max(deaths, 1)).toFixed(2);

  console.log(`%c${summoner}`, COLORS.blue, `-> ${kills}/${deaths}/${assists} | KDA: ${kda}`);
}

function main() {
  const legacyService = new LegacyStatsService();
  const adapter = new LegacyStatsAdapter(legacyService);

  console.log('%cDato crudo del servicio viejo:', COLORS.red, legacyService.fetchRawStats());
  console.log('%cDato adaptado para el marcador nuevo:', COLORS.green);
  showScoreboard(adapter);

  // --- Caso con dato inválido: el adaptador lanza un error claro ---
  console.log('\n%cProbando dato inválido del servicio legado:', COLORS.purple);
  const badService = new LegacyStatsService();
  // Simulamos un dato corrupto sobreescribiendo el método
  badService.fetchRawStats = () => 'DatoCorrupto;abc';
  const badAdapter = new LegacyStatsAdapter(badService);

  try {
    showScoreboard(badAdapter);
  } catch (error) {
    console.log(`  %c[Error capturado] ${(error as Error).message}`, COLORS.red);
  }
}

main();
