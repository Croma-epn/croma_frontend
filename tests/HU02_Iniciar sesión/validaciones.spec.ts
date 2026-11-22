import { expect, test } from '@playwright/test';

const urlInicioSesion = 'http://localhost:3000/autenticacion/inicio-sesion';

test('CA02 - Error por correo vacío', async ({ page }) => {
    // Dado que el usuario está en «Iniciar sesión» y escribió una contraseña.
    await page.goto(urlInicioSesion);
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');

    // Cuando entra en «Correo electrónico» y sale sin escribir.
    const correo = page.getByLabel('Correo electrónico', { exact: true });
    await correo.click();
    await correo.press('Tab');

    // Entonces se muestra «Ingresa tu correo.».
    await expect(page.getByText('Ingresa tu correo.', { exact: true })).toBeVisible();

    let envios = 0;
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlInicioSesion) {
            envios += 1;
        }
    });

    // Cuando pulsa «Iniciar sesión».
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces el formulario no se envía.
    expect(envios).toBe(0);
});

test('CA03 - Error por correo con formato inválido', async ({ page }) => {
    // Dado que el usuario está en «Iniciar sesión» y escribió una contraseña.
    await page.goto(urlInicioSesion);
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');

    // Cuando escribe un correo con formato inválido.
    await page.getByLabel('Correo electrónico', { exact: true }).fill('ana');

    // Entonces se muestra «Ingresa un correo válido.».
    await expect(
        page.getByText('Ingresa un correo válido.', { exact: true }),
    ).toBeVisible();

    let envios = 0;
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlInicioSesion) {
            envios += 1;
        }
    });

    // Cuando pulsa «Iniciar sesión».
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces el formulario no se envía.
    expect(envios).toBe(0);
});

test('CA04 - Error por contraseña vacía', async ({ page }) => {
    // Dado que el usuario está en «Iniciar sesión» y escribió un correo válido.
    await page.goto(urlInicioSesion);
    await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');

    // Cuando entra en «Contraseña» y sale sin escribir.
    const contrasena = page.getByLabel('Contraseña', { exact: true });
    await contrasena.click();
    await contrasena.press('Tab');

    // Entonces se muestra «Ingresa tu contraseña.».
    await expect(
        page.getByText('Ingresa tu contraseña.', { exact: true }),
    ).toBeVisible();

    let envios = 0;
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlInicioSesion) {
            envios += 1;
        }
    });

    // Cuando pulsa «Iniciar sesión».
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces el formulario no se envía.
    expect(envios).toBe(0);
});