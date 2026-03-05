/**
 * Complejidad Temporal: O(n) -> Se hacen todas las operaciones en un ciclo, así se haga la operación más densa
 * Complejidad Espacial: O(n) -> Gracias a que estamos generando otro array invertido (dado a la especificación "Construir un arreglo inv[] que sea m[] pero invertido.")
 */

import assert from "node:assert";

interface ReporteSistema {
  invertido: number[];
  total: number;
  promedio: number;
  max: number;
  min: number;
  cantidadPicos: number;
  indicesPicos: number[];
  picoMasFuerte: number;
}

function monitorearSistema(mediciones: number[]): ReporteSistema {
  const n = mediciones.length;

  if (n < 1 || n > 100_000) {
    throw new Error("El arreglo debe tener entre 1 y 100,000 elementos.");
  }

  const inv: number[] = new Array(n);
  let total = 0;
  let max = -Infinity;
  let min = Infinity;

  const indicesPicos: number[] = [];
  let valorPicoMasFuerte = -Infinity;
  let indicePicoMasFuerte = -1;

  for (let i = 0; i < n; i++) {
    const medicionActual = mediciones[i]!;

    // 1. Suma y Min/Max
    if (medicionActual < -1e9 || medicionActual > 1e9) {
      throw new Error("Rango de medición excedido (-10^9 a 10^9)");
    }
    total += medicionActual;
    if (medicionActual > max) max = medicionActual;
    if (medicionActual < min) min = medicionActual;

    // 2. Inversión
    inv[n - 1 - i] = medicionActual;

    // 3. Detección de picos
    // Candidato a ser un pico 🏔️
    if (i >= 2) {
      const indiceCandidato = i - 1;
      const indiceVecinoIzquierdo = mediciones[i - 2]!;
      const valorCandidato = mediciones[indiceCandidato]!;
      const indiceVecinoDerecho = medicionActual;

      const esPico =
        valorCandidato > indiceVecinoIzquierdo &&
        valorCandidato > indiceVecinoDerecho;

      if (esPico) {
        indicesPicos.push(indiceCandidato);
        if (valorCandidato > valorPicoMasFuerte) {
          valorPicoMasFuerte = valorCandidato;
          indicePicoMasFuerte = indiceCandidato;
        }
      }
    }
  }

  return {
    invertido: inv,
    total,
    promedio: Math.round(total / n),
    max,
    min,
    cantidadPicos: indicesPicos.length,
    indicesPicos,
    picoMasFuerte: indicePicoMasFuerte,
  };
}

function imprimirReporte(reporteSistema: ReporteSistema): void {
  console.log(`\nINV: ${reporteSistema.invertido.join(",")}`);
  console.log(`TOTAL: ${reporteSistema.total}`);
  console.log(`PROMEDIO: ${reporteSistema.promedio}`);
  console.log(`MAX: ${reporteSistema.max}`);
  console.log(`MIN: ${reporteSistema.min}`);
  console.log(`PICOS: ${reporteSistema.cantidadPicos}`);
  console.log(
    `INDICES_PICOS: ${reporteSistema.indicesPicos.length > 0 ? reporteSistema.indicesPicos.join(",") : "NONE"}`,
  );
  console.log(`PICO_MAS_FUERTE: ${reporteSistema.picoMasFuerte}`);

  // Lo mismo, un console.table(reporteSistema) si se le quiere meter fina coquetería 💅
}

function correrTests() {
  console.log("\nIniciando tests del monitoreo avanzado...");

  try {
    // Test 1: Caso Normal con Picos
    const m1 = [10, 20, 10, 30, 5];
    const r1 = monitorearSistema(m1);
    assert.deepStrictEqual(r1.invertido, [5, 30, 10, 20, 10]);
    assert.strictEqual(r1.total, 75);
    assert.strictEqual(r1.promedio, 15);
    assert.deepStrictEqual(r1.indicesPicos, [1, 3]);
    assert.strictEqual(r1.picoMasFuerte, 3);

    // Test 2: Empate de Picos (Gana menor índice)
    const m2 = [0, 50, 0, 50, 0];
    const r2 = monitorearSistema(m2);
    assert.strictEqual(r2.picoMasFuerte, 1);

    // Test 3: Sin picos (Array plano o ascendente)
    const m3 = [10, 20, 30, 40];
    const r3 = monitorearSistema(m3);
    assert.strictEqual(r3.cantidadPicos, 0);
    assert.strictEqual(r3.picoMasFuerte, -1);

    // Test 4: Valores negativos
    const m4 = [-10, -5, -20];
    const r4 = monitorearSistema(m4);
    assert.strictEqual(r4.max, -5);
    assert.strictEqual(r4.indicesPicos[0], 1);

    console.log("\n✅ Todos los tests del sistema de monitoreo pasaron.");
  } catch (error) {
    console.error("❌ Fallo en los tests:");
    console.error(error);
    process.exit(1);
  }
}

correrTests();

imprimirReporte(monitorearSistema([5, 12, 7, 20, 15, 8, 20, 11]));
