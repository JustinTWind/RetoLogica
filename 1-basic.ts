/**
 * Complejidad Temporal: O(n)
 * Complejidad Espacial: O(1)
*/

import assert from "node:assert";

function obtenerTop3Precios(precios: number[]): number[] {
  const n = precios.length;

  if (n < 1 || n > 100_000) {
    throw new Error("El arreglo debe tener entre 1 y 100,000 elementos.");
  }

  let topUno = -1;
  let topDos = -1;
  let topTres = -1;

  for (const precio of precios) {
    if (precio < 0 || precio > 1_000_000_000) {
      throw new Error(`Precio fuera de rango: ${precio}`);
    }

    if (precio > topUno) {
      topTres = topDos;
      topDos = topUno;
      topUno = precio;
    } else if (precio > topDos) {
      topTres = topDos;
      topDos = precio;
    } else if (precio > topTres) {
      topTres = precio;
    }
  }

  return limpiarPodio([topUno, topDos, topTres]);
}

function limpiarPodio(podio: number[]): number[] {
  return podio.filter((top) => top !== -1);
}

// --- SUITE DE TESTS CON NODE:ASSERT ---

function correrTests() {
  console.log("Iniciando tests con node:assert...");

  try {
    // Test 1: Caso Base
    assert.deepStrictEqual(
      obtenerTop3Precios([10, 50, 20, 100, 80]),
      [100, 80, 50],
    );

    // Test 2: Menos de 3 elementos
    assert.deepStrictEqual(obtenerTop3Precios([5, 15]), [15, 5]);

    // Test: Elementos repetidos (Empates)
    assert.deepStrictEqual(
      obtenerTop3Precios([100, 100, 50, 20]),
      [100, 100, 50],
    );

    // Test 3: Valores en el límite inferior
    assert.deepStrictEqual(obtenerTop3Precios([0, 0, 0]), [0, 0, 0]);

    // Test 4: Error de Arreglo Vacío
    assert.throws(
      () => {
        obtenerTop3Precios([]);
      },
      { message: "El arreglo debe tener entre 1 y 100,000 elementos." },
    );

    // Test 5: Error de Rango de Precio
    assert.throws(() => {
      obtenerTop3Precios([-1]);
    }, /Precio fuera de rango/);

    console.log("✅ ¡Todos los tests de node:assert pasaron con éxito!");
  } catch (error) {
    console.error("❌ Fallo en los tests:");
    console.error(error);
    process.exit(1);
  }
}

correrTests();
