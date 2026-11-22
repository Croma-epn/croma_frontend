import { expect, test } from '@playwright/test';

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
    await expect(
        page.getByRole('heading', { name: 'Mis proyectos', exact: true }),
    ).toBeVisible();
});

test('CA03a - Muestra un error al borrar el nombre', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto» y escribió un nombre.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const nombre = page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true });
    await nombre.fill('Proyecto de prueba');

    // Cuando borra el nombre.
    await nombre.clear();

    // Entonces aparece el mensaje sin tener que salir del campo.
    await expect(
        page.getByText('El nombre del proyecto es obligatorio.', { exact: true }),
    ).toBeVisible();
});

test('CA03b - Muestra un error al salir del campo vacío', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const nombre = page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true });

    // Cuando entra al campo y sale sin escribir.
    await nombre.click();
    await nombre.press('Tab');

    // Entonces aparece el mensaje.
    await expect(
        page.getByText('El nombre del proyecto es obligatorio.', { exact: true }),
    ).toBeVisible();
});

test('CA03c - Impide crear el proyecto con el nombre vacío', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto» con el nombre vacío.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    let envios = 0;
    page.on('request', (solicitud) => {
        if (
            solicitud.method() === 'POST' &&
            new URL(solicitud.url()).pathname === '/proyecto/crear'
        ) {
            envios += 1;
        }
    });

    // Cuando pulsa «Crear proyecto» sin escribir un nombre.
    await page.getByRole('button', { name: 'Crear proyecto', exact: true }).click();

    // Entonces aparece el mensaje y no se envía la solicitud de creación.
    await expect(
        page.getByText('El nombre del proyecto es obligatorio.', { exact: true }),
    ).toBeVisible();
    expect(envios).toBe(0);
});

test('CA04a - Actualiza el contador del nombre', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Cuando escribe 5 caracteres en «Nombre del proyecto».
    await page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true })
        .fill('Croma');

    // Entonces el contador del nombre muestra 5/30.
    await expect(
        page.getByText('5/30 caracteres', { exact: true }),
    ).toBeVisible();
});

test('CA04b - Actualiza el contador de la descripción', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Cuando escribe 15 caracteres en «Descripción».
    await page.getByRole('textbox', { name: 'Descripción', exact: true })
        .fill('Diseño de Croma');

    // Entonces el contador de la descripción muestra 15/150.
    await expect(
        page.getByText('15/150 caracteres', { exact: true }),
    ).toBeVisible();
});

test('CA05a - Limita el nombre a 30 caracteres', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const nombre = page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true });
    const texto = 'a'.repeat(30);

    // Cuando escribe 30 caracteres e intenta escribir uno más.
    await nombre.fill(texto);
    await nombre.press('b');

    // Entonces el campo conserva los 30 caracteres y muestra la advertencia.
    await expect(nombre).toHaveValue(texto);
    await expect(
        page.getByText('Alcanzaste el máximo de 30 caracteres.', { exact: true }),
    ).toBeVisible();
});

test('CA05b - Limita la descripción a 150 caracteres', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const descripcion = page.getByRole('textbox', { name: 'Descripción', exact: true });
    const texto = 'a'.repeat(150);

    // Cuando escribe 150 caracteres e intenta escribir uno más.
    await descripcion.fill(texto);
    await descripcion.press('b');

    // Entonces el campo conserva los 150 caracteres y muestra la advertencia.
    await expect(descripcion).toHaveValue(texto);
    await expect(
        page.getByText('Alcanzaste el máximo de 150 caracteres.', { exact: true }),
    ).toBeVisible();
});