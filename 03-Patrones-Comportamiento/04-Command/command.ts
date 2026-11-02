/**
 * ! Patrón Command (Comportamiento)
 *
 * ¿QUÉ HACE?
 * Convierte una acción en un objeto independiente que contiene toda la
 * información necesaria para ejecutarla (y, si se quiere, deshacerla).
 *
 * ¿QUÉ PROBLEMA RESOLVEMOS?
 * En la tienda de LoL puedes comprar y vender ítems, y existe el botón
 * "Deshacer compra" si te equivocaste. Para lograrlo necesitamos guardar un
 * historial de acciones y poder revertirlas en orden. Si la tienda ejecutara
 * las compras directamente sobre el inventario, no habría forma ordenada de
 * deshacerlas.
 *
 * ¿POR QUÉ COMMAND ES ADECUADO?
 * - Cada compra/venta es un objeto con execute() y undo().
 * - El invocador (la tienda) guarda un historial (pila) de comandos.
 * - Deshacer es tan simple como sacar el último comando y llamar a undo().
 *
 * VENTAJAS:
 * - Desacopla al invocador (tienda) del receptor (inventario).
 * - Permite implementar historial, redo, macros y transacciones de forma sencilla.
 *
 * DESVENTAJAS / CUÁNDO NO USARLO:
 * - Aumenta el número de clases; puede ser excesivo para acciones sin undo.
 * - El historial puede consumir mucha memoria si las acciones son muy numerosas.
 *
 * USO REAL: editores de texto (Ctrl+Z / Ctrl+Y), interfaces gráficas (botones
 * de acción) y sistemas de transacciones en bases de datos.
 *
 * https://refactoring.guru/es/design-patterns/command
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Receptor: quien realmente hace el trabajo ----------
class Inventory {
  public gold: number;
  public items: string[] = [];

  constructor(gold: number) {
    this.gold = gold;
  }

  show() {
    console.log(`  Oro: ${this.gold} | Inventario: [${this.items.join(', ')}]`);
  }
}

// ---------- Interfaz Command ----------
interface Command {
  execute(): boolean; // true si se pudo ejecutar
  undo(): void;
}

// ---------- Comandos concretos ----------
class BuyItemCommand implements Command {
  constructor(private inventory: Inventory, private item: string, private price: number) {}

  execute(): boolean {
    if (this.inventory.gold < this.price) {
      console.log(`  %cNo tienes oro suficiente para ${this.item} (${this.price}).`, COLORS.red);
      return false;
    }
    this.inventory.gold -= this.price;
    this.inventory.items.push(this.item);
    console.log(`  Compraste ${this.item} por ${this.price} de oro.`);
    return true;
  }

  undo(): void {
    // Revertimos la compra: devolvemos el oro y quitamos SOLO UNA ocurrencia del ítem
    const idx = this.inventory.items.indexOf(this.item);
    if (idx !== -1) {
      this.inventory.items.splice(idx, 1);
    }
    this.inventory.gold += this.price;
    console.log(`  %cSe deshizo la compra de ${this.item} (+${this.price} de oro).`, COLORS.yellow);
  }
}

class SellItemCommand implements Command {
  constructor(private inventory: Inventory, private item: string, private price: number) {}

  execute(): boolean {
    // Eliminamos SOLO UNA ocurrencia del ítem (no todas las copias)
    const idx = this.inventory.items.indexOf(this.item);
    if (idx === -1) {
      console.log(`  %cNo tienes ${this.item} para vender.`, COLORS.red);
      return false;
    }
    this.inventory.items.splice(idx, 1);
    this.inventory.gold += this.price;
    console.log(`  Vendiste ${this.item} por ${this.price} de oro.`);
    return true;
  }

  undo(): void {
    this.inventory.items.push(this.item);
    this.inventory.gold -= this.price;
    console.log(`  %cSe deshizo la venta de ${this.item} (-${this.price} de oro).`, COLORS.yellow);
  }
}

// ---------- Invocador: la tienda guarda el historial ----------
class Shop {
  private history: Command[] = [];

  run(command: Command) {
    // Solo guardamos en el historial los comandos que sí se ejecutaron
    if (command.execute()) {
      this.history.push(command);
    }
  }

  undoLast() {
    const command = this.history.pop();
    if (!command) {
      console.log('  No hay acciones para deshacer.');
      return;
    }
    command.undo();
  }
}

function main() {
  // Ítems de League Classic; los precios son valores aproximados de ejemplo
  const inventory = new Inventory(3500);
  const shop = new Shop();

  console.log('%cCompras en la tienda:', COLORS.blue);
  shop.run(new BuyItemCommand(inventory, "Berserker's Greaves", 1100));
  shop.run(new BuyItemCommand(inventory, 'Infinity Edge', 3800)); // No alcanza el oro
  shop.run(new BuyItemCommand(inventory, 'Pickaxe', 875));
  inventory.show();

  console.log('\n%cVenta de un ítem:', COLORS.blue);
  shop.run(new SellItemCommand(inventory, 'Pickaxe', 612));
  inventory.show();

  console.log('\n%cDeshacer acciones (de la más reciente a la más antigua):', COLORS.purple);
  shop.undoLast(); // Deshace la venta
  inventory.show();
  shop.undoLast(); // Deshace la compra de Pickaxe
  inventory.show();

  // --- Caso con dos ítems iguales: demuestra que undo elimina SOLO UNA copia ---
  console.log('\n%cCaso con dos ítems iguales (Long Sword x2):', COLORS.blue);
  const inv2 = new Inventory(2000);
  const shop2 = new Shop();
  shop2.run(new BuyItemCommand(inv2, 'Long Sword', 350));
  shop2.run(new BuyItemCommand(inv2, 'Long Sword', 350));
  inv2.show(); // Debe mostrar [Long Sword, Long Sword]

  console.log('%cDeshacer la última compra (debe quedar solo una Long Sword):', COLORS.purple);
  shop2.undoLast();
  inv2.show(); // Debe mostrar [Long Sword]
}

main();
