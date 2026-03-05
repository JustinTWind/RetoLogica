/**
 * Complejidad Temporal: O(n)
 * Complejidad Espacial: O(1)
 */

import assert from "node:assert";

interface Factura {
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
}

function calcularFactura(
  precios: number[],
  cupon: string,
  envio: number,
): Factura {
  const n = precios.length;

  if (n < 1 || n > 100_000) {
    throw new Error("El arreglo debe tener entre 1 y 100,000 elementos.");
  }

  if (envio < 0 || envio > 1_000_000_000) {
    throw new Error("El costo de envío está fuera de los límites.");
  }

  let subtotal = 0;

  for (let i = 0; i < n; i++) {
    if (precios[i]! < 0 || precios[i]! > 1_000_000_000) {
      throw new Error(`Precio en índice ${i} fuera de rango.`);
    }
    subtotal += precios[i]!;
  }

  let descuento = 0;
  let costoEnvioFinal = envio;

  switch (cupon) {
    case "DESC10":
      descuento = subtotal * 0.1;
      break;
    case "DESC20":
      if (subtotal < 200_000) {
        throw new Error("Se ha aplicado un cupón no valido para el subtotal");
      }
      descuento = subtotal * 0.2;
      break;
    case "FREESHIP":
      costoEnvioFinal = 0;
      break;
    case "NONE":
      descuento = 0;
      break;
    default:
      throw new Error("Cupón no reconocido.");
  }

  const base = subtotal - descuento;

  const iva = Math.round(base * 0.19);

  const total = base + iva + costoEnvioFinal;

  return { subtotal, descuento, iva, total };
}

function imprimirFactura(factura: Factura): void { 
  console.log(`SUBTOTAL ${factura.subtotal}`);
  console.log(`DESCUENTO ${factura.descuento}`);
  console.log(`IVA ${factura.iva}`);
  console.log(`TOTAL ${factura.total}`);

  // O un console.table(factura) si lo querés más bonito 👍🙏
}

// --- SUITE DE TESTS CON NODE:ASSERT ---

function correrTests() {
  console.log("Iniciando tests de lógica de factura...");

  try {
    // Test 1: Caso DESC10
    const f1 = calcularFactura([1000, 2000], "DESC10", 500);
    assert.strictEqual(f1.subtotal, 3000);
    assert.strictEqual(f1.descuento, 300);
    assert.strictEqual(f1.iva, 513);
    assert.strictEqual(f1.total, 3713);

    // Test 2: Caso FREESHIP
    const f2 = calcularFactura([10000], "FREESHIP", 5000);
    assert.strictEqual(f2.total, 11900);

    // Test 3: Caso DESC20 (Válido)
    const f3 = calcularFactura([200000], "DESC20", 0);
    assert.strictEqual(f3.descuento, 40000);

    // Test 4: Error DESC20 (Subtotal insuficiente)
    assert.throws(
      () => calcularFactura([150000], "DESC20", 0),
      /Se ha aplicado un cupón no valido para el subtotal/,
    );

    // Test 5: Redondeo de IVA
    const f5 = calcularFactura([102.7], "NONE", 0);
    assert.strictEqual(f5.iva, 20);

    console.log("✅ ¡Todos los tests de la factura pasaron!");
  } catch (error) {
    console.error("❌ Fallo en los tests:");
    console.error(error);
    process.exit(1);
  }
}

correrTests();

imprimirFactura(calcularFactura([150000, 100000], "DESC20", 5000));
