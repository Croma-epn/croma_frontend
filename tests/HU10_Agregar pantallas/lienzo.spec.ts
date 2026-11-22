import { expect, test, type Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    const correo = process.env.CROMA_TEST_CORREO;
    const contrasena = process.env.CROMA_TEST_CONTRASENA;

    if (!correo || !contrasena) {
        throw new Error('Configura las credenciales de prueba.');
    }

    await page.goto('http://localhost:3000/autenticacion/inicio-sesion');
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correo);
    await page.getByLabel('Contraseña', { exact: true }).fill(contrasena);
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    await page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true })
        .fill(`Proyecto HU10 ${Date.now()}`);
    await page.getByRole('button', { name: 'Crear proyecto', exact: true }).click();
});

test('CA01 - Muestra el estado inicial del lienzo vacío', async ({ page }) => {
    // Dado que el estudiante abre un proyecto sin pantallas.
    // Cuando se carga el lienzo del proyecto recién creado.
    const lienzo = page.getByRole('region', {
        name: 'Lienzo de modelado',
        exact: true,
    });

    // Entonces se muestran el título y las instrucciones del lienzo vacío.
    await expect(
        lienzo.getByRole('heading', { name: 'Tu modelo empieza aquí', exact: true }),
    ).toBeVisible();
    await expect(
        lienzo.getByText(
            'Haz clic o arrastra «Pantalla» desde «Herramientas» para colocar la primera pantalla.',
            { exact: true },
        ),
    ).toBeVisible();

    // Y se muestra el panel «Herramientas» con el botón «Pantalla».
    const herramientas = page.getByRole('complementary');
    await expect(
        herramientas.getByRole('heading', { name: 'Herramientas', exact: true }),
    ).toBeVisible();
    await expect(
        herramientas.getByRole('button', { name: 'Pantalla', exact: true }),
    ).toBeVisible();

    // Y se muestra el texto «Lienzo de modelado» con el contador de elementos en 0.
    await expect(
        lienzo.getByText('Lienzo de modelado · 0 elementos', { exact: true }),
    ).toBeVisible();
});

async function distanciaAlPunto(pantalla: Locator, x: number, y: number) {
    const caja = await pantalla.boundingBox();

    if (!caja) {
        return Infinity;
    }

    const centroX = caja.x + caja.width / 2;
    const centroY = caja.y + caja.height / 2;
    return Math.hypot(centroX - x, centroY - y);
}

test('CA02 - Agregar una pantalla con clic', async ({ page }) => {
    // Dado que el estudiante está en el lienzo de un proyecto vacío.
    const lienzo = page.getByRole('region', { name: 'Lienzo de modelado', exact: true });
    const pantalla = lienzo.locator('.react-flow__node.selected');

    // Cuando pulsa «Pantalla» en el panel «Herramientas».
    await page.getByRole('button', { name: 'Pantalla', exact: true }).click();

    // Entonces aparece una pantalla seleccionada con su código y nombre.
    await expect(pantalla.getByText('VC-01', { exact: true })).toBeVisible();
    await expect(pantalla.getByText('Nueva pantalla 1', { exact: true })).toBeVisible();

    // Y aparece el mensaje y el contador suma un elemento.
    await expect(
        page.getByText('Pantalla agregada al lienzo.', { exact: true }),
    ).toBeVisible();
    await expect(
        lienzo.getByText('Lienzo de modelado · 1 elemento', { exact: true }),
    ).toBeVisible();
});

test('CA03 - Agregar una pantalla arrastrándola al lienzo', async ({ page }) => {
    // Dado que el estudiante está en el lienzo de un proyecto vacío.
    const lienzo = page.getByRole('region', { name: 'Lienzo de modelado', exact: true });
    const herramienta = page.getByRole('button', { name: 'Pantalla', exact: true });
    const caja = await lienzo.boundingBox();

    if (!caja) {
        throw new Error('No se pudo medir el lienzo.');
    }

    const destino = {
        x: Math.round(caja.width * 0.6),
        y: Math.round(caja.height * 0.5),
    };

    // Cuando arrastra «Pantalla» y la suelta en el punto elegido.
    await herramienta.dragTo(lienzo, { targetPosition: destino });

    // Entonces el centro de la pantalla seleccionada coincide con el punto de suelta.
    const pantalla = lienzo.locator('.react-flow__node.selected');
    await expect(pantalla).toBeVisible();
    await expect.poll(() =>
        distanciaAlPunto(pantalla, caja.x + destino.x, caja.y + destino.y),
    ).toBeLessThanOrEqual(5);

    // Y aparece el mensaje y el contador suma un elemento.
    await expect(
        page.getByText('Pantalla agregada al lienzo.', { exact: true }),
    ).toBeVisible();
    await expect(
        lienzo.getByText('Lienzo de modelado · 1 elemento', { exact: true }),
    ).toBeVisible();
});

test('CA04 - Centra el lienzo cuando la nueva pantalla queda fuera de la vista', async ({ page }) => {
    // Dado que el estudiante está en el lienzo de un proyecto vacío.
    const lienzo = page.getByRole('region', { name: 'Lienzo de modelado', exact: true });
    const vista = lienzo.locator('.react-flow__viewport');
    await expect(vista).toBeAttached();
    const posicionInicial = await vista.getAttribute('style');

    const caja = await lienzo.boundingBox();

    if (!caja) {
        throw new Error('No se pudo medir el lienzo.');
    }

    // Cuando agrega la primera pantalla, cuya posición inicial rebasa el borde izquierdo.
    await page.getByRole('button', { name: 'Pantalla', exact: true }).click();

    // Entonces el lienzo se desplaza y la nueva pantalla queda centrada.
    const pantalla = lienzo.locator('.react-flow__node.selected');
    await expect.poll(() => vista.getAttribute('style')).not.toBe(posicionInicial);
    await expect.poll(() =>
        distanciaAlPunto(pantalla, caja.x + caja.width / 2, caja.y + caja.height / 2),
    ).toBeLessThanOrEqual(5);
});